const Client = require("../models/Client");

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Manajemen data klien
 */

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Tambah data klien baru
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company_name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data klien berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 client:
 *                   type: object
 */
exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ message: "Klien berhasil ditambahkan", client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Ambil semua data klien
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
exports.getAllClient = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Ambil data klien berdasarkan ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID klien yang ingin diambil
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Klien tidak ditemukan
 */
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id); // Perbaiki req.params.Id menjadi req.params.id
    if (!client) return res.status(404).json({ error: "Klien tidak ditemukan" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

