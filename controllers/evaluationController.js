const { ADMIN_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const EvaluationAspect = require("../models/EvaluationAspect");
const Project = require("../models/Project");
const Client = require("../models/Client");
const Karyawan = require("../models/Karyawan");


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
            return res.status(401).json({ message: "Semua field wajib diisi" });

        const evaluationAspects = await EvaluationAspect.find({}).sort({ _id: 1 })

        if (scores.length != evaluationAspects.length)
            return res.status(403).json({ message: "Score tidak sesuai dengan aspek penilaian" });

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


exports.getAllEvaluationskaryawan = async (req, res) => {
  try {
    let filter = {};

    // Periksa apakah ada client yang terdaftar pada req.user
    if (req.user && req.user.client) {
      filter.client_id = req.user.client._id; // Menyaring berdasarkan client jika user adalah client
    }

    // Periksa apakah ada karyawan yang terdaftar pada req.user
    if (req.user && req.user.karyawan) {
      filter.employees = { $in: [req.user.karyawan._id] }; // Menyaring berdasarkan karyawan jika user adalah karyawan
    }

    // Ambil semua evaluasi sesuai filter karyawan dan client
    const evaluations = await Evaluation.find(filter)
      .populate("client_id employees", "nama_lengkap")
      .populate("project_id", "title");

    if (evaluations.length === 0) {
      return res.status(404).json({ message: "Tidak ada evaluasi ditemukan" });
    }

    // Grouping hasil evaluasi berdasarkan karyawan
    const result = evaluations.map((evaluation) => {
      // Group evaluasi berdasarkan karyawan
      const karyawanEvaluasi = {
        nama_karyawan: evaluation.employees.map((emp) => emp.nama_lengkap).join(", "), // Gabungkan nama karyawan yang dievaluasi
        project_title: evaluation.project_id.title, // Menampilkan title project yang telah dievaluasi
        final_score: evaluation.final_score, // Nilai akhir evaluasi
        results: evaluation.results // Hasil evaluasi per aspek
      };

      return karyawanEvaluasi;
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error); // Untuk membantu debugging
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

exports.getKaryawanProjectAndDetailedEvaluation = async (req, res) => {
    try {
      // 1. Ambil semua karyawan
      const karyawans = await Karyawan.find();
  
      // 2. Proses setiap karyawan
      const results = await Promise.all(karyawans.map(async (karyawan) => {
        // Ambil semua evaluasi yang mencantumkan karyawan ini
        const evaluations = await Evaluation.find({ employees: karyawan._id })
          .populate("project_id", "title") // Ambil judul project
          .populate("client_id", "nama_lengkap"); // Ambil nama client yang menilai (optional)
  
        // Ambil total proyek dari evaluasi (bukan semua proyek yang dia ikuti, hanya yang sudah ada evaluasinya)
        const totalEvaluatedProjects = evaluations.length;
  
        // Hitung rata-rata nilai akhir
        const totalScore = evaluations.reduce((acc, curr) => acc + (curr.final_score || 0), 0);
        const averageScore = totalEvaluatedProjects > 0 ? (totalScore / totalEvaluatedProjects).toFixed(2) : null;
  
        // Format detail evaluasi per project
        const evaluatedProjects = evaluations.map(e => ({
          project_title: e.project_id?.title || "Tidak diketahui",
          client: e.client_id?.nama_lengkap || "Tidak diketahui",
          final_score: e.final_score,
          aspects: e.results  // ini array dari hasil per aspek
        }));
  
        return {
          nama_karyawan: karyawan.nama_lengkap,
          total_project_dinilai: totalEvaluatedProjects,
          rata_rata_point_evaluasi: averageScore,
          evaluasi_projects: evaluatedProjects
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
        message: "Error fetching karyawan evaluation data",
        error: error.message
      });
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
                    return res.status(401).json({ message: `Skor untuk aspek ${aspect.name} tidak valid` });
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
