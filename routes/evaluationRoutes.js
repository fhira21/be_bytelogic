const express = require("express");
const { createEvaluation, getAllEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } = require("../controllers/evaluationController");

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
 *     summary: Tambah evaluasi karyawan
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Evaluasi berhasil ditambahkan
 */
router.post("/", createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Ambil semua evaluasi karyawan
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua evaluasi
 */
router.get("/", getAllEvaluations);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Ambil evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Evaluasi ditemukan
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
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Evaluasi berhasil dihapus
 */
router.delete("/:id", deleteEvaluation);

module.exports = router;
