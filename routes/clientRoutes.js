const express = require("express");
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");

const router = express.Router();

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
router.post("/", createClient);

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
router.get("/", getAllClients);

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
router.get("/:id", getClientById);

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
router.put("/:id", updateClient);

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
router.delete("/:id", deleteClient);

module.exports = router;