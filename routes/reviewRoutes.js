const express = require("express");
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require("../controllers/reviewController");

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tambah review perusahaan
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Review berhasil ditambahkan
 */
router.post("/", createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Ambil semua review perusahaan
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Data review berhasil diambil
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Ambil review berdasarkan ID
 *     tags: [Reviews]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Data review berhasil diambil
 */
router.get("/:id", getReviewById);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Perbarui review berdasarkan ID
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Review berhasil diperbarui
 */
router.put("/:id", updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Hapus review berdasarkan ID
 *     tags: [Reviews]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Review berhasil dihapus
 */
router.delete("/:id", deleteReview);

module.exports = router;
