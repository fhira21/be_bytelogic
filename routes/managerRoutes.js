// routes/managerRoutes.js
const express = require("express");
const { createManager, getAllManagers, getManagerById, updateManager, deleteManager } = require("../controllers/managerController");

const router = express.Router();

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
 */
router.post("/", createManager);

/**
 * @swagger
 * /api/managers:
 *   get:
 *     summary: Ambil semua data manajer
 *     tags: [Managers]
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 */
router.get("/", getAllManagers);

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
 */
router.get("/:id", getManagerById);

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
 */
router.put("/:id", updateManager);

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
 */
router.delete("/:id", deleteManager);

module.exports = router;
