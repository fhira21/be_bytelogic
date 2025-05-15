const express = require("express");
const {
  createEvaluation,
  getKaryawanProjectAndDetailedEvaluation,
  // getAllEvaluations,
  getMyEvaluationsKaryawan,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getProjectEvaluationsByLoggedInClient
} = require("../controllers/evaluationController");
// const { CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE } = require("../constants/role");
const { CLIENT_ROLE, ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");

const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Manajemen data evaluasi karyawan
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Buat evaluasi karyawan oleh klien
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: "67de485e99294aa9f00d54b6"
 *               scores:
 *                 type: array
 *                 description: Daftar skor penilaian, urut sesuai indikator
 *                 items:
 *                   type: number
 *                   minimum: 1
 *                   maximum: 5
 *                 example: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3]
 *               comments:
 *                 type: string
 *                 example: "Kinerja sangat baik."
 *     responses:
 *       201:
 *         description: Evaluasi berhasil ditambahkan
 *       400:
 *         description: Client belum memiliki project atau data tidak lengkap
 *       401:
 *         description: Semua field wajib diisi
 *       403:
 *         description: Skor tidak sesuai aspek penilaian
 *       404:
 *         description: Proyek tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/", verifyToken, verifyRole([CLIENT_ROLE]), createEvaluation);

/**
 * @swagger
 * /api/evaluations/evaluationmykaryawan:
 *   get:
 *     summary: Ambil semua evaluasi by karyawan yang login
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil ditampilkan
 *       404: 
 *         description: Belum ada evaluasi untuk proyek yang dikerjakan.
 *       500:
 *         description: Terjadi kesalahan
 */
router.get("/evaluationmykaryawan", verifyToken, verifyRole([EMPLOYEE_ROLE]), getMyEvaluationsKaryawan);

/**
 * @swagger
 * /api/evaluations/evaluationmyclient:
 *   get:
 *     summary: Ambil semua evaluasi by client yang login
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil ditampilkan
 *       404: 
 *         description: Belum ada evaluasi untuk proyek yang dikerjakan.
 *       500:
 *         description: Terjadi kesalahan
 */
router.get("/evaluationmyclient", verifyToken, verifyRole([CLIENT_ROLE]), getProjectEvaluationsByLoggedInClient);

/**
 * @swagger
 * /api/evaluations/karyawan/evaluasi-detailed:
 *   get:
 *     summary: Ambil semua evaluasi per karyawan (jml proyek, total evaluasi, detail evaluasi)
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan saat mengambil data evaluasi
 */
router.get("/karyawan/evaluasi-detailed", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), getKaryawanProjectAndDetailedEvaluation);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Ambil evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 *       404:
 *         description: Evaluasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/:id", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Perbarui evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scores:
 *                 type: array
 *                 description: Daftar skor penilaian, urut sesuai indikator
 *                 items:
 *                   type: number
 *                   minimum: 1
 *                   maximum: 5
 *                 example: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3]
 *               comments:
 *                 type: string
 *                 example: "Kinerja sangat baik."
 *     responses:
 *       200:
 *         description: Evaluasi berhasil diperbarui
 *       400:
 *         description: Skor tidak sesuai aspek penilaian
 *       404:
 *         description: Evaluasi tidak ditemukan atau akses ditolak
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.put("/:id", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), updateEvaluation);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Hapus evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Evaluasi berhasil dihapus
 *       404:
 *         description: Evaluasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteEvaluation);

module.exports = router;
