const express = require("express");
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require("../controllers/reviewController");
const { CLIENT_ROLE, ADMIN_ROLE } = require("../constants/role");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manajemen data review pengguna terhadap perusahaan
 */

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
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Proyek selesai tepat waktu dan hasilnya sangat memuaskan!"
 *               client_id:
 *                 type: string
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               rating:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review berhasil ditambahkan
 */
router.post("/", verifyToken, verifyRole([CLIENT_ROLE]), createReview);

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
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
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Update ulasan proyek, sangat baik!"
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review berhasil diperbarui
 */
router.put("/:id", verifyToken, verifyRole([CLIENT_ROLE]), updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Hapus review berdasarkan ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Review berhasil dihapus
 */
router.delete("/:id", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), deleteReview);

module.exports = router;
