const { ADMIN_ROLE, CLIENT_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const Karyawan = require("../models/Karyawan");
const Project = require("../models/Project");
const Client = require("../models/Client");


const { createRepository, updateRepository, getCommits } = require("../services/githubService");

exports.createProject = async (req, res) => {
  try {
    const { title, description,framework, figma, client_id, employees, deadline, github_token, status } = req.body;

    const gitHubCreateResponse = await createRepository(github_token, title, description)

    const imagePaths = req.files.map(file => "/uploads/" + file.filename);

    const project = await Project.create({
      title,
      description,
      framework,
      figma,
      status,
      deadline,
      client: client_id,
      manager: req.user.id,
      employees,

      images: imagePaths,

      github_repo_name: gitHubCreateResponse.name,
      github_repo_url: `https://github.com/${gitHubCreateResponse.full_name}`,
      github_username: gitHubCreateResponse.owner.login,
      github_fine_grain_token: github_token,
      sdlc_progress: {
        analisis: 0,
        desain: 0,
        implementasi: 0,
        pengujian: 0,
        maintenance: 0,
      }
    });

    res.status(201).json({ message: "Proyek berhasil dibuat", project });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat proyek", error });
  }
};

exports.getPublicProjectSummary = async (req, res) => {
  try {
    const projects = await Project.find().select("title description framework figma github_repo_url");

    res.status(200).json({
      message: "Berhasil mengambil semua proyek",
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil ringkasan proyek",
      error: error.message
    });
  }
};

exports.getProjectStatusSummary = async (req, res) => {
  try {
    const statusCounts = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          jumlah: { $sum: 1 }
        }
      }
    ]);

    // Inisialisasi agar semua status tetap muncul meskipun tidak ada datanya
    const result = {
      "Waiting List": 0,
      "On Progress": 0,
      "Completed": 0
    };

    // Update jumlah berdasarkan hasil aggregate
    statusCounts.forEach(item => {
      result[item._id] = item.jumlah;
    });

    res.status(200).json({
      message: "Berhasil mendapatkan rekap status proyek",
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data status proyek",
      error: error.message
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    // Mengambil semua proyek dan melakukan populate pada field client dan manager
    const projects = await Project.find().populate('client').populate('manager').populate('employees');

    // Mengembalikan respons dengan status 200 dan data proyek
    res.status(200).json({
      message: "Berhasil mengambil data proyek",
      success: true,
      data: projects
    });
  } catch (error) {
    // Menangani error dan mengembalikan respons dengan status 500
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil proyek",
      error: error.message
    });
  }
};


exports.getKaryawanProjectAndEvaluation = async (req, res) => {
  try {
    // 1. Ambil semua karyawan
    const karyawans = await Karyawan.find();

    // 2. Proses setiap karyawan
    const results = await Promise.all(karyawans.map(async (karyawan) => {
      // Hitung total project yang karyawan ini ikut
      const totalProjects = await Project.countDocuments({ employees: karyawan._id });

      // Cari semua evaluasi yang terkait karyawan ini
      const evaluations = await Evaluation.find({ employees: karyawan._id });

      // Hitung rata-rata final_score dari evaluasi
      let totalScore = 0;
      evaluations.forEach((evalDoc) => {
        if (evalDoc.final_score) {
          totalScore += evalDoc.final_score;
        }
      });

      const averageScore = evaluations.length > 0 ? (totalScore / evaluations.length).toFixed(2) : null;

      return {
        nama_lengkap: karyawan.nama_lengkap,
        total_project: totalProjects,
        rata_rata_point_evaluasi: averageScore
      };
    }));

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching karyawan project and evaluation data",
      error: error.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === CLIENT_ROLE) {
      const client = await Client.findOne({ user: userId });
      if (!client) return res.status(404).json({ message: "Client tidak ditemukan" });

      projects = await Project.find({ client: client._id }, '-github_commits')
        .populate("employees", "name");
    } else if (userRole === EMPLOYEE_ROLE) {
      const employee = await Karyawan.findOne({ user: userId });
      if (!employee) return res.status(404).json({ message: "Karyawan tidak ditemukan" });

      projects = await Project.find({ employees: employee._id }, '-github_commits')
        .populate("client", "name");
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }

    res.status(200).json({ message: "Berhasil mengambil proyek", data: projects });
  } catch (error) {
    console.error("Error getProjects:", error);
    res.status(500).json({ message: "Gagal mengambil data proyek", error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select('+github_fine_grain_token')

    if (project.github_fine_grain_token) {
      try {
        const commits = await getCommits(project.github_fine_grain_token, project.github_username, project.github_repo_name)

        const projectCommits = commits.map(item => ({
          message: item.commit.message,
          author: item.commit.author.name,
          date: item.commit.author.date,
          url: item.html_url
        }))

        project.github_commits = projectCommits

        await project.save()
      } catch (error) {

      }
    }

    return res.status(200).json({ message: "Data proyek berhasil diambil", data: project });
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil dataproyek", error: error.message, errorstack: error });
  }
};

exports.getProjectskaryawanklien = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === CLIENT_ROLE) {
      const client = await Client.findOne({ user: userId });
      if (!client) return res.status(404).json({ message: "Client tidak ditemukan" });

      projects = await Project.find({ client: client._id }, '-github_commits')
        .populate("employees", "name");
    } else if (userRole === EMPLOYEE_ROLE) {
      const employee = await Karyawan.findOne({ user: userId });
      if (!employee) return res.status(404).json({ message: "Karyawan tidak ditemukan" });

      projects = await Project.find({ employees: employee._id }, '-github_commits')
        .populate("client", "name");
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }

    res.status(200).json({ message: "Berhasil mengambil proyek", data: projects });
  } catch (error) {
    console.error("Error getProjects:", error);
    res.status(500).json({ message: "Gagal mengambil data proyek", error: error.message });
  }
};

exports.getTotalProjectskaryawan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Hanya untuk karyawan
    if (userRole !== EMPLOYEE_ROLE) {
      return res.status(403).json({ message: "Akses hanya diizinkan untuk karyawan" });
    }

    const employee = await Karyawan.findOne({ user: userId });
    if (!employee) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    // Ambil semua proyek yang dikerjakan oleh karyawan ini
    const projects = await Project.find({ employees: employee._id }, '-github_commits');

    // Hitung total proyek dan jumlah berdasarkan status
    const totalProjects = projects.length;
    const statusCount = {
      "Waiting List": 0,
      "On Progress": 0,
      "Completed": 0
    };

    projects.forEach(project => {
      const status = project.status;
      if (statusCount[status] !== undefined) {
        statusCount[status]++;
      }
    });

    res.status(200).json({
      message: "Berhasil menghitung total proyek karyawan",
      data: {
        totalProjects,
        statusSummary: statusCount
      }
    });

  } catch (error) {
    console.error("Error saat mengambil data proyek karyawan:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (req.user.role === ADMIN_ROLE) {
      const {
        description,
        client_id,
        employees,
        deadline,
        completiondate,
        status,
        sdlc_progress,
        image_to_delete
      } = req.body;

      const project = await Project.findOne({ _id: projectId });
      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      // ==== Handle Gambar ====
      // 1. Hapus gambar berdasarkan index
      if (image_to_delete) {
        let deleteIndexes = Array.isArray(image_to_delete)
          ? image_to_delete.map(i => parseInt(i))
          : [parseInt(image_to_delete)];

        deleteIndexes.sort((a, b) => b - a); // agar index tidak geser saat splice

        for (let index of deleteIndexes) {
          if (project.images && index >= 0 && index < project.images.length) {
            project.images.splice(index, 1);
          }
        }
      }

      // 2. Tambah gambar baru (jika ada upload)
      if (req.files && req.files.length > 0) {
        const uploadedPaths = req.files.map(file => "/uploads/" + file.filename);
        project.images.push(...uploadedPaths);
      }

      // ==== Update data proyek lainnya ====
      project.description = description || project.description;
      project.client = client_id || project.client;
      project.employees = employees || project.employees;
      project.deadline = deadline || project.deadline;
      project.completiondate = completiondate;
      project.status = status || project.status;
      project.sdlc_progress = sdlc_progress
        ? JSON.parse(sdlc_progress)
        : project.sdlc_progress;

      const updatedProject = await project.save();

      return res.status(200).json({
        message: "Proyek berhasil diperbarui",
        updatedProject
      });
    } else {
      return res.status(403).json({ message: "Akses ditolak" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Gagal memperbarui data proyek",
      error: error.message,
      errorstack: error
    });
  }
};


exports.deleteProject = async (req, res) => {
  if (req.user.role !== "manager/admin") {
    return res.status(403).json({ message: "Hanya Manager yang dapat menghapus proyek." });
  }

  try {
    const { projectId } = req.params;
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    res.status(200).json({ message: "Proyek berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus proyek", error });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      analisis,
      desain,
      implementasi,
      pengujian,
      maintenance
    } = req.body;

    const project = await Project.findById(projectId).select('+github_fine_grain_token');
    if (!project) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    if (!project.employees.includes(req.user.userId) && !project.manager == req.user.id) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke proyek ini." });
    }

    project.sdlc_progress = {
      analisis,
      desain,
      implementasi,
      pengujian,
      maintenance
    };
    await project.save();

    res.status(200).json({ message: "Status proyek diperbarui", project });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui status proyek", error });
  }
};

exports.getKaryawanProjectAndEvaluation = async (req, res) => {
  try {
    // 1. Ambil semua karyawan
    const karyawans = await Karyawan.find();

    // 2. Proses setiap karyawan
    const results = await Promise.all(karyawans.map(async (karyawan) => {
      // Hitung total project yang karyawan ini ikut
      const totalProjects = await Project.countDocuments({ employees: karyawan._id });

      // Cari semua evaluasi yang terkait karyawan ini
      const evaluations = await Evaluation.find({ employees: karyawan._id });

      // Hitung rata-rata final_score dari evaluasi
      let totalScore = 0;
      evaluations.forEach((evalDoc) => {
        if (evalDoc.final_score) {
          totalScore += evalDoc.final_score;
        }
      });

      const averageScore = evaluations.length > 0 ? (totalScore / evaluations.length).toFixed(2) : null;

      return {
        nama_lengkap: karyawan.nama_lengkap,
        total_project: totalProjects,
        rata_rata_point_evaluasi: averageScore
      };
    }));

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching karyawan project and evaluation data",
      error: error.message
    });
  }
};
