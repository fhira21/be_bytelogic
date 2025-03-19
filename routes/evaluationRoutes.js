const express = require("express");
const { createEvaluation, getAllEvaluations, getEvaluationById } = require("../controllers/evaluationController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Manajemen evaluasi karyawan
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Tambah evaluasi karyawan (Hanya Klien/Manajer)
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - client_id
 *               - employee_id
 *               - scores
 *             properties:
 *               project_id:
 *                 type: string
 *               client_id:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               scores:
 *                 type: object
 *                 properties:
 *                   quality_of_work:
 *                     type: number
 *                   productivity:
 *                     type: number
 *                   technical_skills:
 *                     type: number
 *                   communication:
 *                     type: number
 *                   discipline:
 *                     type: number
 *                   initiative_and_creativity:
 *                     type: number
 *                   client_satisfaction:
 *                     type: number
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evaluasi berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/", createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Ambil semua evaluasi karyawan
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua evaluasi
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/", getAllEvaluations);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Ambil evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Evaluasi ditemukan
 *       404:
 *         description: Evaluasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/:id", getEvaluationById);

module.exports = router;
