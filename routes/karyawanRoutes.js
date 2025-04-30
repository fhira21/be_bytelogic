const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const { createKaryawan,
    getAllKaryawan, 
    getKaryawanById, 
    updateKaryawan, 
    deleteKaryawan
} = require("../controllers/karyawanController")

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
 *     summary: Tambah karyawan baru
 *     tags: [Karyawan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               jabatan:
 *                 type: string
 *             required:
 *               - nama
 *               - email
 *               - jabatan
 *     responses:
 *       201:
 *         description: Karyawan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nama:
 *                   type: string
 *                 email:
 *                   type: string
 *                 jabatan:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       500:
 *         description: Gagal menambahkan karyawan
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), createKaryawan);

/**
 * @swagger
 * /api/karyawan:
 *   get:
 *     summary: Ambil semua data karyawan
 *     tags: [Karyawan]
 *     responses:
 *       200:
 *         description: Daftar semua karyawan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nama:
 *                     type: string
 *                   email:
 *                     type: string
 *                   jabatan:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Gagal mengambil data karyawan
 */
router.get("/", verifyToken, verifyRole([ADMIN_ROLE]), getAllKaryawan);

/**
 * @swagger
 * /api/karyawan/{id}:
 *   get:
 *     summary: Ambil karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID karyawan
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data karyawan ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nama:
 *                   type: string
 *                 email:
 *                   type: string
 *                 jabatan:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Gagal mengambil data karyawan
 */
router.get("/:id", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), getKaryawanById);

/**
 * @swagger
 * /api/karyawan/{id}:
 *   put:
 *     summary: Perbarui data karyawan
 *     tags: [Karyawan]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID karyawan
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               jabatan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Karyawan berhasil diperbarui
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data karyawan
 */
router.put("/:id", verifyToken, verifyRole([ADMIN_ROLE, EMPLOYEE_ROLE]), updateKaryawan);

/**
 * @swagger
 * /api/karyawan/{id}:
 *   delete:
 *     summary: Hapus karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID karyawan
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Karyawan berhasil dihapus
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Gagal menghapus karyawan
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]),deleteKaryawan);

module.exports = router;
