const express = require("express");
const { createClient, getAllClient, getClientByID } = require("../controllers/clientController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Manajemen data klien
 */

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Tambah data klien baru (Hanya bisa dilakukan oleh Manager/Admin)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
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
 *         description: Data klien berhasil ditambahkan
 *       403:
 *         description: Akses ditolak (Hanya Manager/Admin)
 */
router.post("/", verifyToken, verifyRole("manager/admin", "client"), createClient);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Ambil semua data klien (Hanya Admin & Manager)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *       403:
 *         description: Akses ditolak (Hanya Admin & Manager)
 */
router.get("/", verifyToken, verifyRole("manager/admin"), async (req, res) => {
    try {
        const client = await client.find();
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data klien", error: error.message });
    }
});

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Ambil data klien berdasarkan ID (Admin, Manager, atau Client itu sendiri)
 *     tags: [Clients]
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
 *         description: Data klien berhasil diambil
 *       403:
 *         description: Akses ditolak
 */
router.get("/:id", verifyToken, verifyRole("manager/admin", "client"), getClientByID);
  

module.exports = router;
