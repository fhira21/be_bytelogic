const { ADMIN_ROLE, CLIENT_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const Project = require("../models/Project");
const { createRepository, updateRepository, getCommits } = require("../services/githubService");

exports.createProject = async (req, res) => {
  try {
    const { title, description, client_id, employees, deadline, github_token } = req.body;

    const gitHubCreateResponse = await createRepository(github_token, title, description)

    const project = await Project.create({
      title,
      description,
      status: "Perancangan",
      deadline,
      client: client_id,
      manager: req.user.id,
      employees,

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

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === ADMIN_ROLE) {
      projects = await Project.find({}, '-github_commits').populate("client", "name").populate("employees", "name");
    } else if (req.user.role === CLIENT_ROLE) {
      projects = await Project.find({ client: req.user.userId }, '-github_commits').populate("employees", "name");
    } else if (req.user.role === EMPLOYEE_ROLE) {
      projects = await Project.find({ employees: req.user.userId }, '-github_commits').populate("client", "name");
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }

    res.status(200).json({ message: "Berhasil mengambil proyek", data: projects });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data proyek", error });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select('+github_fine_grain_token')

    if (github_token) {
      const commits = await getCommits(project.github_fine_grain_token, project.github_username, project.github_repo_name)

      const projectCommits = commits.map(item => ({
        message: item.commit.message,
        author: item.commit.author.name,
        date: item.commit.author.date,
        url: item.html_url
      }))

      project.github_commits = projectCommits

      await project.save()
    }

    return res.status(200).json({ message: "Data proyek berhasil diambil", data: project });
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil proyek", error: error.message, errorstack: error });
  }
}

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (req.user.role === ADMIN_ROLE) {
      const { title, description, client_id, employees, deadline, github_token, status, sdlc_progress } = req.body;

      const project = await Project.findOne({ _id: projectId });
      if (!project) {
        return res.status(404).json({ message: "Proyek tidak ditemukan" });
      }

      const commits = await getCommits(project.github_fine_grain_token, project.github_username, project.github_repo_name)

      const projectCommits = commits.map(item => ({
        message: item.commit.message,
        author: item.commit.author.name,
        date: item.commit.author.date,
        url: item.html_url
      }))

      project.github_commits = projectCommits

      let updateRepositoryResponse = null;

      if (title || description) {
        updateRepositoryResponse = await updateRepository(
          github_token,
          project.github_username,
          project.github_repo_name,
          title || project.title,
          description || project.description
        );
      }

      const updateData = {
        title,
        description,
        client: client_id,
        employees,
        deadline,
        status,
        sdlc_progress,
        github_fine_grain_token: github_token
      };

      if (updateRepositoryResponse) {
        updateData.github_repo_name = updateRepositoryResponse.name;
        updateData.github_repo_url = `https://github.com/${updateRepositoryResponse.full_name}`;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        { new: true }
      );

      return res.status(200).json({ message: "Proyek berhasil diperbarui", updatedProject });
    }

  } catch (error) {
    return res.status(500).json({ message: "Gagal memperbarui proyek", error: error.message, errorstack: error });
  }
};

exports.deleteProject = async (req, res) => {
  if (req.user.role !== "manager") {
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

    const commits = await getCommits(project.github_fine_grain_token, project.github_username, project.github_repo_name)
    
    const projectCommits = commits.map(item => ({
      message: item.commit.message,
      author: item.commit.author.name,
      date: item.commit.author.date,
      url: item.html_url
    }))

    project.github_commits = projectCommits

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
