const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewById,
  getMyReviews,
  updateMyReview,
  updateReview,
  deleteReview,
  getReviewStats,
} = require("../controllers/reviewController");
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
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Proyek selesai tepat waktu dan hasilnya sangat memuaskan!"
 *               rating:
 *                 type: number
 * 
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review berhasil ditambahkan
 *       400:
 *         description: Semua field (review,client_id, rating) harus diisi
 *       500:
 *         description: Gagal menambahkan review
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
 *       500:
 *         description: Gagal mengambil data review
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /api/reviews/myreviews:
 *   get:
 *     summary: Ambil semua review milik client yang sedang login
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Review berhasil diambil
 *       403:
 *         description: Akses ditolak, token atau peran tidak sesuai
 *       500:
 *         description: Server error
 */
router.get("/myreviews", verifyToken, verifyRole([CLIENT_ROLE]), getMyReviews);

/**
 * @swagger
 * /api/reviews/stats:
 *   get:
 *     summary: Tapilkan rata" rating
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Statistik review berhasil diambil
 *       403:
 *         description: Akses ditolak, token atau peran tidak sesuai
 *       500:
 *         description: Gagal mengambil statistik review
 */
router.get("/stats", verifyToken, verifyRole([ADMIN_ROLE]), getReviewStats);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Ambil data review berdasarkan ID Login
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
 *       404:
 *         description: Review tidak ditemukan
 *       500:
 *         description: Gagal mengambil data review
 */
router.get("/:id", verifyToken, verifyRole([CLIENT_ROLE]), getReviewById);

/**
 * @swagger
 * /api/reviews/myreview:
 *   put:
 *     summary: Update review milik client yang sedang login
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review berhasil diperbarui
 *       404:
 *         description: Review atau client tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put("/myreview", verifyToken, verifyRole([CLIENT_ROLE]), updateMyReview);

/**
 * @swagger
 * /api/reviews/update:
 *   put:
 *     summary: Perbarui review berdasarkan ID
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - review
 *               - rating
 *             properties:
 *               review:
 *                 type: string
 *                 example: "Proyek selesai tepat waktu dan hasilnya sangat memuaskan!"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Data review berhasil diambil
 *       404:
 *         description: Review tidak ditemukan
 *       500:
 *         description: Gagal mengambil data review
 */
router.put("/update", verifyToken, verifyRole([CLIENT_ROLE]), updateReview);

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
 *         description: Data review berhasil diambil
 *       404:
 *         description: Review tidak ditemukan
 *       500:
 *         description: Gagal mengambil data review
 */
router.delete("/:id", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), deleteReview);

module.exports = router;
