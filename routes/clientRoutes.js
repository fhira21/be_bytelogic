const express = require("express");
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");

const router = express.Router();

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Tambah data klien baru
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Data klien berhasil ditambahkan
 */
router.post("/", createClient);

/**
 * @swagger
 * /api/client:
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
 * /api/client/{id}:
 *   get:
 *     summary: Ambil data klien berdasarkan ID
 *     tags: [Clients]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 */
router.get("/:id", getClientById);

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Perbarui data klien berdasarkan ID
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Data klien berhasil diperbarui
 */
router.put("/:id", updateClient);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Hapus data klien berdasarkan ID
 *     tags: [Clients]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Data klien berhasil dihapus
 */
router.delete("/:id", deleteClient);

module.exports = router;
