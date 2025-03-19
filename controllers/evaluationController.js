const Evaluation = require("../models/Evaluation");

// Menambahkan evaluasi
exports.createEvaluation = async (req, res) => {
    try {
        const { project_id, client_id, employee_id, scores, comments } = req.body;

        if (!project_id || !client_id || !employee_id || !scores) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        const newEvaluation = new Evaluation({
            project_id,
            client_id,
            employee_id,
            scores,
            comments
        });
        
        await newEvaluation.save();
        res.status(201).json({ message: "Evaluasi berhasil ditambahkan", data: newEvaluation });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Mendapatkan semua evaluasi
exports.getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find().populate("project_id client_id employee_id", "name");
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Mendapatkan evaluasi berdasarkan ID
exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id).populate("project_id client_id employee_id", "name");
        if (!evaluation) {
            return res.status(404).json({ message: "Evaluasi tidak ditemukan" });
        }
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Memperbarui evaluasi
exports.updateEvaluation = async (req, res) => {
    try {
        const updatedEvaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEvaluation) {
            return res.status(404).json({ message: "Evaluasi tidak ditemukan" });
        }
        res.status(200).json({ message: "Evaluasi berhasil diperbarui", data: updatedEvaluation });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Menghapus evaluasi
exports.deleteEvaluation = async (req, res) => {
    try {
        const deletedEvaluation = await Evaluation.findByIdAndDelete(req.params.id);
        if (!deletedEvaluation) {
            return res.status(404).json({ message: "Evaluasi tidak ditemukan" });
        }
        res.status(200).json({ message: "Evaluasi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};
