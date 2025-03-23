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
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteClient);

module.exports = router;