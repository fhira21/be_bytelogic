const { ADMIN_ROLE, CLIENT_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const Karyawan = require("../models/Karyawan");
const Project = require("../models/Project");
const Client = require("../models/Client");
const {
  createRepository,
  getCommits,
  getRepoIssues,
  getProjectProgressFromIssues,
} = require("../services/githubService");

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      framework,
      figma,
      client_id,
      employees,
      deadline,
      github_token,
      status,
    } = req.body;

    const gitHubCreateResponse = await createRepository(
      github_token,
      title,
      description
    );

    const imagePaths = req.files.map((file) => "/uploads/" + file.filename);

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
    });

    res.status(201).json({ message: "Proyek berhasil dibuat", project });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat proyek", error });
  }
};

exports.getPublicProjectSummary = async (req, res) => {
  try {
    const projects = await Project.find().select(
      "title description framework figma github_repo_url"
    );

    res.status(200).json({
      message: "Berhasil mengambil semua proyek",
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil ringkasan proyek",
      error: error.message,
    });
  }
};

exports.getProjectStatusSummary = async (req, res) => {
  try {
    const statusCounts = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          jumlah: { $sum: 1 },
        },
      },
    ]);

    // Inisialisasi agar semua status tetap muncul meskipun tidak ada datanya
    const result = {
      "Waiting List": 0,
      "On Progress": 0,
      Completed: 0,
    };

    // Update jumlah berdasarkan hasil aggregate
    statusCounts.forEach((item) => {
      result[item._id] = item.jumlah;
    });

    res.status(200).json({
      message: "Berhasil mendapatkan rekap status proyek",
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data status proyek",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    // Mengambil semua proyek dan melakukan populate pada field client dan manager
    const projects = await Project.find()
      .populate("client")
      .populate("manager")
      .populate("employees");

    // Mengembalikan respons dengan status 200 dan data proyek
    res.status(200).json({
      message: "Berhasil mengambil data proyek",
      success: true,
      data: projects,
    });
  } catch (error) {
    // Menangani error dan mengembalikan respons dengan status 500
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil proyek",
      error: error.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select(
      "+github_fine_grain_token"
    );

    if (!project) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    let githubCommits = [];
    let githubIssues = [];
    let progressInfo = null;

    if (
      project.github_fine_grain_token &&
      project.github_username &&
      project.github_repo_name
    ) {
      // Get commits
      try {
        const commits = await getCommits(
          project.github_fine_grain_token,
          project.github_username,
          project.github_repo_name
        );

        githubCommits = commits.map((item) => ({
          message: item.commit.message,
          author: item.commit.author.name,
          date: item.commit.author.date,
          url: item.html_url,
        }));
      } catch (err) {
        console.error("❌ Error fetching commits:", err.message);
      }

      // Get issues & progress
      try {
        const issues = await getRepoIssues(
          project.github_fine_grain_token,
          project.github_username,
          project.github_repo_name
        );

        const realIssues = issues.filter((issue) => !issue.pull_request);
        const closedIssues = realIssues.filter(
          (issue) => issue.state === "closed"
        ).length;
        const totalIssues = realIssues.length;
        const progress =
          totalIssues > 0 ? Math.round((closedIssues / totalIssues) * 100) : 0;

        progressInfo = {
          total: totalIssues,
          closed: closedIssues,
          progressPercentage: progress,
        };

        githubIssues = realIssues.map((issue) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          url: issue.html_url,
          assignee: issue.assignee?.login || null,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
        }));
      } catch (err) {
        console.error("❌ Error fetching issues:", err.message);
      }
    }

    return res.status(200).json({
      message: "Data proyek berhasil diambil",
      data: {
        ...project.toObject(),
        githubCommits,
        githubIssues,
        githubProgress: progressInfo,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil data proyek",
      error: error.message,
      errorstack: error,
    });
  }
};

exports.getProjectsklien = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId; // Sesuaikan dengan struktur token JWT-mu

    // Cari klien berdasarkan user yang login
    const client = await Client.findOne({ user_id: userId });
    if (!client) {
      return res.status(404).json({ message: "Klien tidak ditemukan" });
    }

    // Ambil proyek-proyek berdasarkan _id klien
    const projects = await Project.find({ client: client._id })
      .populate("employees", "name")
      .populate("github_commits")
      .select("+github_fine_grain_token");

    // Hitung total proyek
    const totalProjects = projects.length;

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        let githubIssues = [];
        let progressInfo = null;

        if (
          project.github_username &&
          project.github_repo_name &&
          project.github_fine_grain_token
        ) {
          try {
            githubIssues = await getRepoIssues(
              project.github_fine_grain_token,
              project.github_username,
              project.github_repo_name
            );

            const realIssues = githubIssues.filter(
              (issue) => !issue.pull_request
            );
            const closedIssues = realIssues.filter(
              (issue) => issue.state === "closed"
            ).length;
            const totalIssues = realIssues.length;
            const progress =
              totalIssues > 0
                ? Math.round((closedIssues / totalIssues) * 100)
                : 0;

            progressInfo = {
              total: totalIssues,
              closed: closedIssues,
              progressPercentage: progress,
            };

            // Transform data for frontend
            githubIssues = realIssues.map((issue) => ({
              number: issue.number,
              title: issue.title,
              state: issue.state,
              url: issue.html_url,
              assignee: issue.assignee?.login || null,
              created_at: issue.created_at,
              updated_at: issue.updated_at,
            }));
          } catch (err) {
            console.error(
              `❌ Error fetching GitHub issues for ${project.github_repo_name}:`,
              err.message
            );
          }
        }

        return {
          ...project.toObject(),
          githubProgress: progressInfo,
          githubIssues: githubIssues,
        };
      })
    );

    res.status(200).json({
      message: "Berhasil mengambil proyek berdasarkan klien yang login",
      totalProjects: totalProjects,
      data: projectsWithProgress,
    });
  } catch (error) {
    console.error("❌ Error getProjectsByClientLogin:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data proyek",
      error: error.message,
    });
  }
};

exports.getTotalProjectskaryawan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Hanya untuk karyawan
    if (userRole !== EMPLOYEE_ROLE) {
      return res
        .status(403)
        .json({ message: "Akses hanya diizinkan untuk karyawan" });
    }

    const employee = await Karyawan.findOne({ user: userId });
    if (!employee) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    // Ambil semua proyek yang dikerjakan oleh karyawan ini (tanpa github_commits)
    const projects = await Project.find(
      { employees: employee._id },
      "-github_commits"
    );

    // Hitung total dan kelompokkan berdasarkan status
    const totalProjects = projects.length;

    const statusSummary = {
      "Waiting List": [],
      "On Progress": [],
      Completed: [],
    };

    projects.forEach((project) => {
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
            Completed: statusSummary["Completed"].length,
          },
          detail: statusSummary,
        },
      },
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
        image_to_delete,
      } = req.body;

      const project = await Project.findOne({ _id: projectId });
      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      // Hapus gambar jika diminta
      if (image_to_delete) {
        let deleteIndexes = Array.isArray(image_to_delete)
          ? image_to_delete.map((i) => parseInt(i))
          : [parseInt(image_to_delete)];

        deleteIndexes.sort((a, b) => b - a); // reverse agar index tidak bergeser saat dihapus
        for (let index of deleteIndexes) {
          if (project.images && index >= 0 && index < project.images.length) {
            project.images.splice(index, 1);
          }
        }
      }

      // Tambahkan gambar baru jika ada
      if (req.files && req.files.length > 0) {
        const newPaths = req.files.map((file) => "/uploads/" + file.filename);
        project.images.push(...newPaths);
      }

      // Update data lain
      project.title = title || project.title;
      project.description = description || project.description;
      project.client = client_id || project.client;
      project.employees = employees || project.employees;
      project.deadline = deadline || project.deadline;
      project.completiondate = completiondate || project.completiondate;
      project.status = status || project.status;
      await project.save();

      return res.status(200).json({
        message: "Proyek berhasil diperbarui",
        success: true,
        data: project,
      });
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }
  } catch (error) {
    console.error("❌ Error saat updateProject:", error.message);
    return res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui proyek",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  if (req.user.role !== "manager/admin") {
    return res
      .status(403)
      .json({ message: "Hanya Manager yang dapat menghapus proyek." });
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
