const express = require("express");
const { createClient, getAllClient, getClientById } = require("../controllers/clientController"); // Tambahkan getClientById

const router = express.Router();

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Tambah data klien
 *     tags: [Client]
 *     operationId: createClient
 */
router.post("/", createClient);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Ambil semua data klien
 *     tags: [Client]
 *     operationId: getAllClients  # Perbaiki operationId agar unik
 */
router.get("/", getAllClient);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Ambil data klien berdasarkan ID
 *     tags: [Client]
 *     operationId: getClientById  # Perbaiki nama agar sesuai fungsi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID klien yang ingin diambil
 */
router.get("/:id", getClientById);

module.exports = router;
