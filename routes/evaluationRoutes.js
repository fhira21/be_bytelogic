// routes/evaluationRoutes.js
const express = require("express");
const { createEvaluation, getKaryawanProjectAndDetailedEvaluation, getAllEvaluations,getAllEvaluationskaryawan, getEvaluationById, updateEvaluation, deleteEvaluation } = require("../controllers/evaluationController");
const { CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE } = require("../constants/role");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Manajemen data untuk Evaluasi karyawan
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Tambah evaluasi karyawan oleh klien
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
 *                 description: Daftar skor penilaian, urut sesuai indikator yang ditentukan
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
 *       404:
 *         description: Project not found!
 *       400:
 *         description: Client belum memiliki project
 *       401:
 *         description: Semua field wajib diisi
 *       403:
 *         description: Score tidak sesuai dengan aspek penilaian
 *       500:
 *         description: Terjadi kesalahan
 */
router.post("/", verifyToken, verifyRole([CLIENT_ROLE]), createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Ambil semua evaluasi yang ada
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan
 */
router.get("/", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]),  getAllEvaluations);

/**
 * @swagger
 * /api/evaluations/evaluationkaraywan:
 *   get:
 *     summary: Ambil semua evaluasi karyawan
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan
 */
router.get("/evaluationkaraywan", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]),  getAllEvaluationskaryawan);

/**
 * @swagger
 * /api/evaluations/karyawan/evaluasi-detailed:
 *   get:
 *     summary: Ambil semua evaluasi per employee
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 *       500:
 *         description: Error fetching karyawan evaluation data
 */
router.get("/karyawan/evaluasi-detailed",verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), getKaryawanProjectAndDetailedEvaluation);

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
 *         description : terjadi kesalahan
 */
router.get("/:id", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Perbarui evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 example: 90
 *               comments:
 *                 type: string
 *                 example: "Performa meningkat."
 *     responses:
 *       200:
 *         description: Evaluasi berhasil diperbarui
 *       404:
 *         description: Evaluasi tidak ditemukan atau anda tidak memiliki akases
 *       400:
 *         description: Score tidak sesuai dengan aspek penilaian
 *       401:
 *         deskripsi: Skor untuk aspek
 *       500:
 *         deskripsi: Terjadi kesalahan
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
 *         deskription: Evaluasi tidak ditemukan
 *       500:
 *         description: Terjadi Kesalahan
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteEvaluation);

module.exports = router;
