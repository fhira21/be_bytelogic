const express = require("express");
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");
const { verifyRole, verifyToken } = require("../middlewares/authMiddleware");
const { CLIENT_ROLE, ADMIN_ROLE } = require("../constants/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Manajemen data klien
 */

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Tambah data klien baru
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               nomor_telepon:
 *                 type: string
 *                 example: "08123456789"
 *               alamat:
 *                 type: string
 *                 example: "Jl. Contoh No. 123"
 *     responses:
 *       201:
 *         description: Data klien berhasil ditambahkan
 *       400:
 *         description: Email sudah mendaftar sebagai klien lain
 *       500:
 *         description:Gagal menambahkan data klien
 */
router.post("/", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), createClient);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Ambil semua data klien
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *       500:
 *         description: Gagal mengambil data klien
 */
router.get("/", verifyToken, verifyRole([ADMIN_ROLE]), getAllClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Ambil data klien berdasarkan ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *       400:
 *         description: ID tidak valid
 *       404:
 *         description: Klien tidak ditemukan
 *       500:
 *         description: Gagal mengambil datd
 */
router.get("/:id", verifyRole, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), getClientById);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Perbarui data klien berdasarkan ID
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alamat:
 *                 type: string
 *                 example: "Jl. Baru No. 456"
 *     responses:
 *       200:
 *         description: Data klien berhasil diperbarui
 *       404:
 *         description:Klien tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data klien
 */
router.put("/:id", verifyRole, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Hapus data klien berdasarkan ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data klien berhasil dihapus
 *       404:
 *         description:Klien tidak ditemukan
 *       500:
 *         description: Gagal menghapus data klien
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteClient);

module.exports = router;