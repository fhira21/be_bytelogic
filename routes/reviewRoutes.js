const express = require("express");
const { createReview, getAllReviews } = require("../controllers/reviewController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manajemen review perusahaan
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tambah review perusahaan
 *     tags: [Reviews]
 *     description: Menambahkan review dari klien terkait proyek yang dikerjakan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - client_id
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 description: Ulasan dari klien
 *                 example: "Proyek selesai tepat waktu dan hasilnya sangat memuaskan!"
 *               client_id:
 *                 type: string
 *                 description: ID klien yang memberikan review
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               rating:
 *                 type: number
 *                 description: Rating dari klien (1-5)
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review berhasil ditambahkan
 *       400:
 *         description: Data tidak lengkap
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.post("/", verifyToken, verifyRole("client"), createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Ambil semua review perusahaan
 *     tags: [Reviews]
 *     description: Mengambil daftar semua review yang telah diberikan oleh klien.
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua review
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get("/", verifyToken, verifyRole("client"), getAllReviews);

module.exports = router;
