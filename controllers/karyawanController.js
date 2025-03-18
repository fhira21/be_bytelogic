const Karyawan = require("../models/Karyawan");

/**
 * @swagger
 * tags:
 *   name: Karyawan
 *   description: Manajemen data karyawan
 */

/**
 * @swagger
 * /api/karyawan:
 *   post:
 *     summary: Tambah data karyawan baru
 *     tags: [Karyawan]
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
 *               education:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Data karyawan berhasil ditambahkan
 */
exports.createKaryawan = async (req, res) => {
  try {
    const karyawan = new Karyawan(req.body);
    await karyawan.save();
    res.status(201).json({ message: "Karyawan berhasil ditambahkan", karyawan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/karyawan:
 *   get:
 *     summary: Ambil semua data karyawan
 *     tags: [Karyawan]
 *     responses:
 *       200:
 *         description: Data karyawan berhasil diambil
 */
exports.getAllKaryawan = async (req, res) => {
  try {
    const karyawan = await Karyawan.find();
    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/karyawan/{id}:
 *   get:
 *     summary: Ambil data karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data karyawan berhasil diambil
 */
exports.getKaryawanById = async (req, res) => {
  try {
    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) return res.status(404).json({ error: "Karyawan tidak ditemukan" });
    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
