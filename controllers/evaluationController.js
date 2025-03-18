const Evaluation = require("../models/Evaluation");
const Project = require("../models/Project");

// ✅ Client: Berikan Evaluasi ke Karyawan
exports.createEvaluation = async (req, res) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Hanya Klien yang dapat memberikan evaluasi." });
  }

  try {
    const { projectId, employeeId, communication, discipline, technicalSkill, comments } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project || project.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke proyek ini." });
    }

    const evaluation = await Evaluation.create({
      project: projectId,
      client: req.user.userId,
      employee: employeeId,
      communication,
      discipline,
      technicalSkill,
      comments
    });

    res.status(201).json({ message: "Evaluasi berhasil disimpan", evaluation });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

// ✅ Manager & Karyawan: Lihat Evaluasi
exports.getEvaluations = async (req, res) => {
  try {
    let evaluations;
    if (req.user.role === "employee") {
      evaluations = await Evaluation.find({ employee: req.user.userId }).populate("project", "title");
    } else if (req.user.role === "manager") {
      evaluations = await Evaluation.find().populate("project", "title").populate("employee", "name");
    } else {
      return res.status(403).json({ message: "Akses tidak diizinkan" });
    }

    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data evaluasi", error });
  }
};
