const { ADMIN_ROLE, CLIENT_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const Karyawan = require("../models/Karyawan");
const Project = require("../models/Project");
const Client = require("../models/Client");


const { createRepository, getCommits } = require("../services/githubService");

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
      if (!client)
        return res.status(404).json({ message: "Client tidak ditemukan" });

      projects = await Project.find({ client: client._id })
        .populate("employees", "name")
        .populate("github_commits"); // <-- tambahkan jika github_commits adalah ref
    } else if (userRole === EMPLOYEE_ROLE) {
      const employee = await Karyawan.findOne({ user: userId });
      if (!employee)
        return res.status(404).json({ message: "Karyawan tidak ditemukan" });

      projects = await Project.find({ employees: employee._id })
        .populate("client", "name")
        .populate("github_commits"); // <-- tambahkan jika github_commits adalah ref
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

    // Ambil semua proyek yang dikerjakan oleh karyawan ini (tanpa github_commits)
    const projects = await Project.find({ employees: employee._id }, '-github_commits');

    // Hitung total dan kelompokkan berdasarkan status
    const totalProjects = projects.length;

    const statusSummary = {
      "Waiting List": [],
      "On Progress": [],
      "Completed": []
    };

    projects.forEach(project => {
      const status = project.status;
      if (statusSummary[status] !== undefined) {
        statusSummary[status].push(project);
      }
    });

    res.status(200).json({
      message: "Berhasil mengambil total dan detail proyek karyawan",
      data: {
        totalProjects,
        statusSummary: {
          count: {
            "Waiting List": statusSummary["Waiting List"].length,
            "On Progress": statusSummary["On Progress"].length,
            "Completed": statusSummary["Completed"].length
          },
          detail: statusSummary
        }
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
        title,
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

      if (req.files && req.files.length > 0) {
        const uploadedPaths = req.files.map(file => "/uploads/" + file.filename);
        project.images.push(...uploadedPaths);
      }

      project.title = title || project.title;
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