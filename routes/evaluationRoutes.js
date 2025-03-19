// routes/evaluationRoutes.js
const express = require("express");
const { createEvaluation, getAllEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } = require("../controllers/evaluationController");

const router = express.Router();

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Tambah evaluasi baru
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
 *                 example: "60c72b2f9b1d8e5a7c8d24e3"
 *               reviewer_id:
 *                 type: string
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               score:
 *                 type: number
 *                 example: 85
 *               comments:
 *                 type: string
 *                 example: "Kinerja sangat baik."
 *     responses:
 *       201:
 *         description: Evaluasi berhasil ditambahkan
 */
router.post("/", createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Ambil semua evaluasi
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 */
router.get("/", getAllEvaluations);

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
 */
router.get("/:id", getEvaluationById);

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
 */
router.put("/:id", updateEvaluation);

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
 */
router.delete("/:id", deleteEvaluation);

module.exports = router;
