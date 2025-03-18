const express = require("express");
const { createManager, getAllManager, getManagerById } = require("../controllers/managerController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Manager
 *   description: Manajemen data manajer
 */

/**
 * @swagger
 * /api/manager:
 *   post:
 *     summary: Tambah data manajer (Hanya Admin)
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *               email:
 *                 type: string
 *               nomor_telepon:
 *                 type: string
 *               alamat:
 *                 type: string
 *               foto_profile:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data manajer berhasil ditambahkan
 *       403:
 *         description: Akses ditolak (Hanya Admin)
 */
router.post("/", verifyToken, verifyRole(["manager/admin"]), createManager);

/**
 * @swagger
 * /api/manager:
 *   get:
 *     summary: Ambil semua data manajer (Hanya Admin & Manager)
 *     tags: [Manager]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 *       403:
 *         description: Akses ditolak (Hanya Admin & Manager)
 */
router.get("/", verifyToken, verifyRole(["manager/admin"]), getAllManager);

/**
 * @swagger
 * /api/manager/{id}:
 *   get:
 *     summary: Ambil data manajer berdasarkan ID (Hanya Admin & Manager)
 *     tags: [Manager]
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
 *         description: Data manajer berhasil diambil
 *       403:
 *         description: Akses ditolak (Hanya Admin & Manager)
 */
router.get("/:id", verifyToken, verifyRole(["manager/admin"]), getManagerById);

module.exports = router;
