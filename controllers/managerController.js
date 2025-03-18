const Manager = require("../models/Manager");

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
 *     summary: Tambah data manajer baru
 *     tags: [Manager]
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
 *               birth_date:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data manajer berhasil ditambahkan
 */
exports.createManager = async (req, res) => {
  try {
    const manager = new Manager(req.body);
    await manager.save();
    res.status(201).json({ message: "Manajer berhasil ditambahkan", manager });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/manager:
 *   get:
 *     summary: Ambil semua data manajer
 *     tags: [Manager]
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 */
exports.getAllManager = async (req, res) => {
  try {
    const manager = await Manager.find();
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/manager/{id}:
 *   get:
 *     summary: Ambil data manajer berdasarkan ID
 *     tags: [Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 */
exports.getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) return res.status(404).json({ error: "Manajer tidak ditemukan" });
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
