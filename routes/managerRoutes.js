// routes/managerRoutes.js
const express = require("express");
const { createManager, getAllManagers, getManagerById, updateManager, deleteManager } = require("../controllers/managerController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { ADMIN_ROLE } = require("../constants/role");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Managers
 *   description: Manajemen data Admin/manager
 */

/**
 * @swagger
 * /api/managers:
 *   post:
 *     summary: Tambah data manajer baru
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "janedoe@example.com"
 *               nomor_telepon:
 *                 type: string
 *                 example: "08123456789"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Manajer No. 45"
 *     responses:
 *       201:
 *         description: Data manajer berhasil ditambahkan
 *       500:
 *         description: Gagal menambahkan data manajer
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), createManager);

/**
 * @swagger
 * /api/managers:
 *   get:
 *     summary: Ambil semua data manajer
 *     tags: [Managers]
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 *       500:
 *         description: Gagal mengambil data manajer
 */
router.get("/", verifyToken, verifyRole([ADMIN_ROLE]), getAllManagers);

/**
 * @swagger
 * /api/managers/{id}:
 *   get:
 *     summary: Ambil data manajer berdasarkan ID
 *     tags: [Managers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 *       404:
 *         description: data manajer tidak ditemukan
 *       500:
 *         description: Gagal mengambil data manajer
 */
router.get("/:id", verifyToken, verifyRole([ADMIN_ROLE]), getManagerById);

/**
 * @swagger
 * /api/managers/{id}:
 *   put:
 *     summary: Perbarui data manajer berdasarkan ID
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alamat:
 *                 type: string
 *                 example: "Jl. Baru No. 99"
 *     responses:
 *       200:
 *         description: Data manajer berhasil diperbarui
 *       404:
 *         description: Data manajer tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data manajer
 */
router.put("/:id", verifyToken, verifyRole([ADMIN_ROLE]), updateManager);

/**
 * @swagger
 * /api/managers/{id}:
 *   delete:
 *     summary: Hapus data manajer berdasarkan ID
 *     tags: [Managers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data manajer berhasil dihapus
 *       404:
 *         description: data manajer tidak ditemukan
 *       500:
 *         description: Gagal menghapus data manajer
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteManager);

module.exports = router;
