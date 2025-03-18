const express = require("express");
const router = express.Router();
const Karyawan = require("../models/Karyawan");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Pastikan path benar
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Folder tempat menyimpan file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    },
  });

/**
 * @swagger
 * tags:
 *   name: Karyawan
 *   description: Manajemen data karyawan
 */

/**
 * @swagger
 * /api/karyawan:
 *   get:
 *     summary: Ambil semua data karyawan
 *     tags: [Karyawan]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar karyawan
 */
router.get("/", verifyToken, verifyRole(["manager/admin"]), async (req, res) => {
    try {
        const karyawan = await Karyawan.find();
        res.status(200).json(karyawan);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
    }
});

/**
 * @swagger
 * /api/karyawan/{id}:
 *   get:
 *     summary: Ambil data karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Karyawan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data karyawan
 */
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const karyawan = await Karyawan.findById(req.params.id);
        if (!karyawan) {
            return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        }
        res.status(200).json(karyawan);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
    }
});

/**
 * @swagger
 * /api/karyawan:
 *   post:
 *     summary: Tambah karyawan baru
 *     tags: [Karyawan]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               nama_lengkap:
 *                 type: string
 *               email:
 *                 type: string
 *               nomor_telepon:
 *                 type: string
 *               alamat:
 *                 type: string
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *               jenis_kelamin:
 *                 type: string
 *                 enum: ["laki-laki", "perempuan"]
 *               foto_profile:
 *                 type: string
 *                 format: binary
 *               nik:
 *                 type: string
 *               riwayat_pendidikan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jenjang:
 *                       type: string
 *                     institusi:
 *                       type: string
 *                     tahun_lulus:
 *                       type: number
 *               status_pernikahan:
 *                 type: string
 *                 enum: ["menikah", "belum menikah"]
 *     responses:
 *       201:
 *         description: Karyawan berhasil ditambahkan
 */
const uploads = multer({ storage });

router.post("/", verifyToken, verifyRole("manager/admin"), upload.single("foto_profile"), async (req, res) => {
    try {
        const newKaryawan = new Karyawan({
            ...req.body,
            foto_profile: req.file ? "/uploads/" + req.file.filename : null
        });
        await newKaryawan.save();
        res.status(201).json({ message: "Karyawan berhasil ditambahkan", data: newKaryawan });
    } catch (error) {
        res.status(400).json({ message: "Gagal menambahkan karyawan", error: error.message });
    }
});


/**
 * @swagger
 * /api/karyawan/{id}:
 *   put:
 *     summary: Update data karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Karyawan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_lengkap:
 *                 type: string
 *               email:
 *                 type: string
 *               nomor_telepon:
 *                 type: string
 *               alamat:
 *                 type: string
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *               jenis_kelamin:
 *                 type: string
 *                 enum: ["laki-laki", "perempuan"]
 *               foto_profile:
 *                 type: string
 *               nik:
 *                 type: string
 *               riwayat_pendidikan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jenjang:
 *                       type: string
 *                     institusi:
 *                       type: string
 *                     tahun_lulus:
 *                       type: number
 *               status_pernikahan:
 *                 type: string
 *                 enum: ["menikah", "belum menikah"]
 *     responses:
 *       200:
 *         description: Data karyawan berhasil diperbarui
 */
router.put("/:id", verifyToken, verifyRole(["manager/admin"]), async (req, res) => {
    try {
        const karyawan = await Karyawan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!karyawan) {
            return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        }
        res.status(200).json(karyawan);
    } catch (error) {
        res.status(400).json({ message: "Gagal memperbarui karyawan", error: error.message });
    }
});

/**
 * @swagger
 * /api/karyawan/{id}:
 *   delete:
 *     summary: Hapus karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Karyawan
 *     responses:
 *       200:
 *         description: Karyawan berhasil dihapus
 */
router.delete("/:id", verifyToken, verifyRole(["manager/admin"]), async (req, res) => {
    try {
        const karyawan = await Karyawan.findByIdAndDelete(req.params.id);
        if (!karyawan) {
            return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        }
        res.status(200).json({ message: "Karyawan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus karyawan", error: error.message });
    }
});

module.exports = router;
