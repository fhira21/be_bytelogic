// const { ADMIN_ROLE, CLIENT_ROLE } = require("../constants/role");
const Evaluation = require("../models/Evaluation");
const EvaluationAspect = require("../models/EvaluationAspect");
const Project = require("../models/Project");
const Client = require("../models/Client");
const Karyawan = require("../models/Karyawan");

// Menambahkan evaluasi
const mongoose = require("mongoose");
const { CLIENT_ROLE } = require("../constants/role");

exports.createEvaluation = async (req, res) => {
  try {
    const { project_id, scores, comments } = req.body;

    // Ambil data proyek lengkap (termasuk client dan employees)
    const project = await Project.findById(project_id).populate(
      "client employees"
    );

    if (!project) {
      return res.status(404).json({ message: "Proyek tidak ditemukan!" });
    }

    // Cek apakah proyek sudah memiliki evaluasi
    const existingEvaluation = await Evaluation.findOne({ project_id });
    if (existingEvaluation) {
      return res
        .status(400)
        .json({ message: "Proyek ini sudah memiliki evaluasi!" });
    }

    const client_id = project.client._id;
    const employees = project.employees.map((emp) => emp._id);

    if (!scores || !Array.isArray(scores)) {
      return res
        .status(400)
        .json({ message: "Skor evaluasi tidak valid atau kosong" });
    }

    const evaluationAspects = await EvaluationAspect.find({}).sort({ _id: 1 });

    if (scores.length !== evaluationAspects.length) {
      return res
        .status(400)
        .json({
          message: "Jumlah skor tidak sesuai dengan jumlah aspek evaluasi",
        });
    }

    let evaluationResult = [];
    let maxScore = 0;
    let tempScore = 0;

    evaluationAspects.forEach((aspect, index) => {
      const currentScore = parseInt(scores[index]);

      // Validasi skor 1–5
      if (currentScore < 1 || currentScore > 5) {
        return res
          .status(400)
          .json({
            message: `Skor tidak valid pada aspek ${aspect.nama_aspek}`,
          });
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
    });

    const finalScore = (tempScore / maxScore) * 100;

    // Buat evaluasi baru
    const newEvaluation = new Evaluation({
      project_id,
      client_id,
      employees,
      results: evaluationResult,
      final_score: finalScore,
      comments,
    });

    await newEvaluation.save();

    // Populate data untuk ditampilkan nama proyek, klien, dan karyawan
    const populatedEvaluation = await Evaluation.findById(newEvaluation._id)
      .populate({ path: "project_id", select: "title" })
      .populate({ path: "client_id", select: "nama_lengkap" })
      .populate({ path: "employees", select: "nama_lengkap" });

    res.status(201).json({
      message: "Evaluasi berhasil ditambahkan",
      data: {
        evaluation: populatedEvaluation,
        client_name: populatedEvaluation.client_id.nama_lengkap,
        employees: populatedEvaluation.employees.map((emp) => emp.nama_lengkap),
        project_title: populatedEvaluation.project_id.title,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

exports.getMyEvaluationsKaryawan = async (req, res) => {
  try {
    const userId = req.user.userId;

    const employee = await Karyawan.findOne({ user: userId });
    if (!employee) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    // Ambil semua project yang memiliki karyawan ini
    const projects = await Project.find({ employees: employee._id }).select(
      "_id"
    );

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "Karyawan ini belum mengerjakan proyek apa pun." });
    }

    const projectIds = projects.map((project) => project._id);

    // Ambil semua evaluasi berdasarkan project yang ditemukan
    const evaluations = await Evaluation.find({
      project_id: { $in: projectIds },
    })
      .populate("project_id", "title")
      .populate("client_id", "nama_lengkap");

    if (!evaluations || evaluations.length === 0) {
      return res
        .status(404)
        .json({ message: "Belum ada evaluasi untuk proyek yang dikerjakan." });
    }

    const totalScore = evaluations.reduce(
      (acc, cur) => acc + cur.final_score,
      0
    );
    const averageScore = (totalScore / evaluations.length).toFixed(2);

    const result = evaluations.map((evaluation) => ({
      evaluation_id: evaluation._id,
      project_title: evaluation.project_id.title,
      client_name: evaluation.client_id.nama_lengkap,
      final_score: evaluation.final_score,
      results: evaluation.results,
    }));

    res.status(200).json({
      message: "Data evaluasi berhasil ditampilkan",
      success: true,
      nama_karyawan: employee.nama_lengkap,
      jumlah_proyek_dinilai: evaluations.length,
      rata_rata_nilai: Number(averageScore),
      detail_evaluasi: result,
    });
  } catch (error) {
    console.error("Error getMyEvaluationsKaryawan:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

exports.getProjectEvaluationsByLoggedInClient = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Cari data client berdasarkan user login
    const client = await Client.findOne({ user: userId });
    if (!client) {
      return res.status(404).json({ message: "Client tidak ditemukan" });
    }

    // Ambil semua proyek milik klien
    const projects = await Project.find({ client: client._id })
      .populate("employees", "nama_lengkap")
      .select("_id title employees");

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "Klien belum memiliki proyek." });
    }

    // Ambil semua evaluasi milik klien ini
    const evaluations = await Evaluation.find({ client_id: client._id });

    // Buat map evaluasi agar pencarian cepat
    const evaluatedProjectMap = new Map();
    evaluations.forEach((evaluation) => {
      evaluatedProjectMap.set(evaluation.project_id.toString(), evaluation);
    });

    // Susun data proyek dan status evaluasi
    const result = projects.map((project) => {
      const evalData = evaluatedProjectMap.get(project._id.toString());
      return {
        project_id: project._id,
        project_title: project.title,
        employees: project.employees,
        sudah_dinilai: !!evalData,
        evaluasi: evalData
          ? {
              evaluation_id: evalData._id,
              final_score: evalData.final_score,
              results: evalData.results,
            }
          : null,
      };
    });

    res.status(200).json({
      message: "Data proyek dan evaluasi berhasil ditampilkan",
      total_proyek: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error getProjectEvaluationsByLoggedInClient:", error);
    res.status(500).json({
      message: "Terjadi kesalahan",
      error: error.message,
    });
  }
};

// exports.getKaryawanProjectAndDetailedEvaluation = async (req, res) => {
//   try {
//     // 1. Ambil semua karyawan
//     const karyawans = await Karyawan.find();

//     // 2. Proses setiap karyawan
//     const results = await Promise.all(
//       karyawans.map(async (karyawan) => {
//         // Ambil semua evaluasi yang mencantumkan karyawan ini di field 'employees'
//         const evaluations = await Evaluation.find({ employees: karyawan._id })
//           .populate("project_id", "title")
//           .populate("client_id", "nama_lengkap");

//         const totalEvaluatedProjects = evaluations.length;

//         // Hitung rata-rata nilai akhir
//         const totalScore = evaluations.reduce(
//           (acc, curr) => acc + (curr.final_score || 0),
//           0
//         );
//         const averageScore =
//           totalEvaluatedProjects > 0
//             ? (totalScore / totalEvaluatedProjects).toFixed(2)
//             : null;

//         // Format detail evaluasi
//         const evaluatedProjects = evaluations.map((e) => ({
//           project_title: e.project_id?.title || "Tidak diketahui",
//           client: e.client_id?.nama_lengkap || "Tidak diketahui",
//           final_score: e.final_score,
//           aspects: e.results,
//         }));

//         // Tetap tampilkan semua karyawan, meskipun belum dievaluasi
//         return {
//           nama_karyawan: karyawan.nama_lengkap,
//           total_project_dinilai: totalEvaluatedProjects,
//           rata_rata_point_evaluasi: averageScore,
//           evaluasi_projects: evaluatedProjects,
//         };
//       })
//     );

//     res.status(200).json({
//       message: "Data evaluasi berhasil diambil",
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Terjadi kesalahan saat mengambil data evaluasi",
//       error: error.message,
//     });
//   }
// };

exports.getEvaluationSummaryByEmployee = async (req, res) => {
  try {
    // Ambil semua karyawan
    const allEmployees = await Karyawan.find();

    const results = [];

    for (const employee of allEmployees) {
      // Ambil semua evaluasi yang melibatkan karyawan ini
      const evaluations = await Evaluation.find({ employees: employee._id })
        .populate("project_id", "title")
        .populate("client_id", "nama_lengkap") // bisa kamu ganti sesuai field client
        .populate("results.aspect_id", "name") // nama aspek evaluasi
        .lean();

      // Hitung total skor dari semua evaluasi
      const totalScore = evaluations.reduce(
        (sum, eval) => sum + (eval.final_score || 0),
        0
      );

      // Hitung jumlah evaluasi
      const totalEvaluations = evaluations.length;

      // Hitung jumlah proyek unik
      const projectIds = new Set(
        evaluations.map((e) => e.project_id._id.toString())
      );
      const totalProjects = projectIds.size;

      // Susun detail evaluasi
      const evaluationDetails = evaluations.map((e) => ({
        evaluation_id: e._id,
        project_title: e.project_id.title,
        client_name: e.client_id.nama_lengkap,
        final_score: e.final_score,
        results: e.results,
        comments: e.comments,
      }));

      // Masukkan ke hasil
      results.push({
        employee_id: employee._id,
        nama_karyawan: employee.nama_lengkap,
        total_final_score: totalScore,
        total_projects: totalProjects,
        total_evaluations: totalEvaluations,
        evaluations: evaluationDetails,
      });
    }

    res
      .status(200)
      .json({
        message: "Evaluasi per karyawan berhasil diambil",
        data: results,
      });
  } catch (error) {
    console.error("Error fetching evaluation summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate("project_id", "title") // Judul proyek
      .populate("client_id", "nama_lengkap") // Nama klien
      .populate("employees", "nama_lengkap"); // Nama karyawan

    // Format output agar lebih rapi
    const formattedEvaluations = evaluations.map((e) => ({
      project_title: e.project_id?.title || "Tidak diketahui",
      client: e.client_id?.nama_lengkap || "Tidak diketahui",
      final_score: e.final_score || 0,
      evaluated_employees: e.employees.map((emp) => emp.nama_lengkap),
      aspects: e.results,
    }));

    res.status(200).json({
      message: "Berhasil mengambil semua data evaluasi",
      success: true,
      data: formattedEvaluations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data evaluasi",
      error: error.message,
    });
  }
};

// Mendapatkan evaluasi berdasarkan ID
exports.getEvaluationById = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    if (req.user.client) filter.client_id = req.user.client._id;
    if (req.user.karyawan) filter.employees = { $in: [req.user.karyawan._id] };

    const evaluation = await Evaluation.findOne(filter)
      .populate("client_id employees", "nama_lengkap")
      .populate("project_id", "title");
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluasi tidak ditemukan" });
    }
    res.status(200).json(evaluation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Memperbarui evaluasi
exports.updateEvaluation = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Cek akses sesuai role
    if (req.user.client) filter.client_id = req.user.client._id;
    if (req.user.karyawan) filter.employees = { $in: [req.user.karyawan._id] };

    // Cari evaluasinya dulu
    const existingEvaluation = await Evaluation.findOne(filter);
    if (!existingEvaluation) {
      return res.status(404).json({
        message: "Evaluasi tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    // Validasi field yang boleh diupdate (contoh: hanya comment atau score saja)
    const { comments, scores } = req.body;

    if (scores) {
      const evaluationAspects = await EvaluationAspect.find({}).sort({
        _id: 1,
      });

      if (scores.length !== evaluationAspects.length) {
        return res
          .status(400)
          .json({ message: "Score tidak sesuai dengan aspek penilaian" });
      }

      let evaluationResult = [];
      let maxScore = 0;
      let tempScore = 0;

      for (let i = 0; i < evaluationAspects.length; i++) {
        const aspect = evaluationAspects[i];
        const currentScore = parseInt(scores[i]);

        if (
          isNaN(currentScore) ||
          currentScore < 1 ||
          currentScore > aspect.criteria.length
        ) {
          return res
            .status(401)
            .json({ message: `Skor untuk aspek ${aspect.name} tidak valid` });
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

    res.status(200).json({
      message: "Evaluasi berhasil diperbarui",
      data: existingEvaluation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
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
    res
      .status(500)
      .json({ message: "Terjadi kesalahan", error: error.message });
  }
};
