const Project = require("../models/Project");

// ✅ Manager: Buat Proyek Baru
exports.createProject = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Hanya Manager yang dapat membuat proyek." });
  }

  try {
    const { title, description, framework, link, image, clientId, employees } = req.body;

    const project = await Project.create({
      title,
      description,
      framework,
      link,
      image,
      client: clientId,
      employees
    });

    res.status(201).json({ message: "Proyek berhasil dibuat", project });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat proyek", error });
  }
};

// ✅ Semua User: Lihat Semua Proyek (hanya data yang relevan)
exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "manager") {
      projects = await Project.find().populate("client", "name").populate("employees", "name");
    } else if (req.user.role === "client") {
      projects = await Project.find({ client: req.user.userId }).populate("employees", "name");
    } else if (req.user.role === "employee") {
      projects = await Project.find({ employees: req.user.userId }).populate("client", "name");
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data proyek", error });
  }
};

// ✅ Manager: Edit Proyek
exports.updateProject = async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Hanya Manager yang dapat mengedit proyek." });
  }

  try {
    const { projectId } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    res.status(200).json({ message: "Proyek berhasil diperbarui", updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui proyek", error });
  }
};

// ✅ Manager: Hapus Proyek
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

// ✅ Karyawan: Update Progress Proyek
exports.updateProjectStatus = async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ message: "Hanya Karyawan yang dapat memperbarui status proyek." });
  }

  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    if (!project.employees.includes(req.user.userId)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke proyek ini." });
    }

    project.status = status;
    await project.save();

    res.status(200).json({ message: "Status proyek diperbarui", project });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui status proyek", error });
  }
};
