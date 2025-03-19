const express = require("express");
const { createManager, getAllManagers, getManagerById, updateManager, deleteManager } = require("../controllers/managerController");

const router = express.Router();

/**
 * @swagger
 * /api/manager:
 *   post:
 *     summary: Tambah data manajer
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Data manajer berhasil ditambahkan
 */
router.post("/", createManager);

/**
 * @swagger
 * /api/manager:
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
 * /api/manager/{id}:
 *   get:
 *     summary: Ambil data manajer berdasarkan ID
 *     tags: [Managers]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 */
router.get("/:id", getManagerById);

/**
 * @swagger
 * /api/manager/{id}:
 *   put:
 *     summary: Perbarui data manajer berdasarkan ID
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Data manajer berhasil diperbarui
 */
router.put("/:id", updateManager);

/**
 * @swagger
 * /api/manager/{id}:
 *   delete:
 *     summary: Hapus data manajer berdasarkan ID
 *     tags: [Managers]
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Data manajer berhasil dihapus
 */
router.delete("/:id", deleteManager);

module.exports = router;
