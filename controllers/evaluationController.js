const { ADMIN_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const EvaluationAspect = require("../models/EvaluationAspect");
const Project = require("../models/Project");
const Client = require("../models/Client");

// Menambahkan evaluasi
exports.createEvaluation = async (req, res) => {
    try {
        const { scores, comments, project_id } = req.body;

        let client_id;

        if (req.user.role == ADMIN_ROLE)
            client_id = req.body.client_id
        else
            client_id = req.user.client._id

        const project = await Project.findOne({ client: client_id, _id: project_id })
        if (!project)
            return res.status(404).json({ message: "Project not found!" })

        const { employees } = project

        if (!project)
            return res.status(400).json({ message: "Client belum memiliki project" })

        if (!scores)
            return res.status(400).json({ message: "Semua field wajib diisi" });

        const evaluationAspects = await EvaluationAspect.find({}).sort({ _id: 1 })

        if (scores.length != evaluationAspects.length)
            return res.status(400).json({ message: "Score tidak sesuai dengan aspek penilaian" });

        let evaluationResult = []

        let maxScore = 0
        let tempScore = 0

        evaluationAspects.forEach((aspect, index) => {
            const currentScore = parseInt(scores[index])
            tempScore += currentScore * aspect.weight
            maxScore += aspect.criteria.length
            evaluationResult.push({
                aspect_id: aspect._id,
                selected_criteria: {
                    description: aspect.criteria[currentScore - 1].label,
                    value: currentScore,
                }
            })
        })

        const finalScore = tempScore / maxScore * 100;

        const newEvaluation = new Evaluation({
            project_id,
            client_id,
            employees,
            results: evaluationResult,
            final_score: finalScore,
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
        let filter = {}
        if (req.user.client)
            filter.client_id = req.user.client._id
        if (req.user.karyawan)
            filter.employees = { $in: [req.user.karyawan._id] }

        const evaluations = await Evaluation.find(filter).populate("client_id employees", "nama_lengkap").populate("project_id", "title");
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Mendapatkan evaluasi berdasarkan ID
exports.getEvaluationById = async (req, res) => {
    try {
        let filter = { _id: req.params.id }

        if (req.user.client)
            filter.client_id = req.user.client._id
        if (req.user.karyawan)
            filter.employees = { $in: [req.user.karyawan._id] }

        const evaluation = await Evaluation.findOne(filter).populate("client_id employees", "nama_lengkap").populate("project_id", "title");
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
        let filter = { _id: req.params.id };

        // Cek akses sesuai role
        if (req.user.client)
            filter.client_id = req.user.client._id;
        if (req.user.karyawan)
            filter.employees = { $in: [req.user.karyawan._id] };

        // Cari evaluasinya dulu
        const existingEvaluation = await Evaluation.findOne(filter);
        if (!existingEvaluation) {
            return res.status(404).json({ message: "Evaluasi tidak ditemukan atau Anda tidak memiliki akses" });
        }

        // Validasi field yang boleh diupdate (contoh: hanya comment atau score saja)
        const { comments, scores } = req.body;

        if (scores) {
            const evaluationAspects = await EvaluationAspect.find({}).sort({ _id: 1 });

            if (scores.length !== evaluationAspects.length) {
                return res.status(400).json({ message: "Score tidak sesuai dengan aspek penilaian" });
            }

            let evaluationResult = [];
            let maxScore = 0;
            let tempScore = 0;

            for (let i = 0; i < evaluationAspects.length; i++) {
                const aspect = evaluationAspects[i];
                const currentScore = parseInt(scores[i]);

                if (isNaN(currentScore) || currentScore < 1 || currentScore > aspect.criteria.length) {
                    return res.status(400).json({ message: `Skor untuk aspek ${aspect.name} tidak valid` });
                }

                tempScore += currentScore * aspect.weight;
                maxScore += aspect.criteria.length;

                evaluationResult.push({
                    aspect_id: aspect._id,
                    selected_criteria: {
                        description: aspect.criteria[currentScore - 1].label,
                        value: currentScore,
                    },
                });
            }

            existingEvaluation.results = evaluationResult;
            existingEvaluation.final_score = (tempScore / maxScore) * 100;
        }

        if (comments !== undefined) {
            existingEvaluation.comments = comments;
        }

        await existingEvaluation.save();

        res.status(200).json({ message: "Evaluasi berhasil diperbarui", data: existingEvaluation });
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
