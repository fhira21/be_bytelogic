const express = require("express");
const {
  createClient,
  getAllClients,
  getClientProfile,
  getClientById,
  updateClientProfile,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const { verifyRole, verifyToken } = require("../middlewares/authMiddleware");
const { CLIENT_ROLE, ADMIN_ROLE } = require("../constants/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Manajemen data klien
 */

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
 *             required:
 *               - user_id
 *               - nama_lengkap
 *               - email
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "68147731885820689d6b714d"
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
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *     responses:
 *       201:
 *         description: Data klien berhasil ditambahkan
 *       400:
 *         description: Email sudah terdaftar sebagai klien lain
 *       500:
 *         description: Gagal menambahkan data klien
 */
router.post("/", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), createClient);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Ambil semua data klien
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Data klien berhasil diambil
 *       500:
 *         description: Gagal mengambil data klien
 */
router.get("/", verifyToken, verifyRole([ADMIN_ROLE]), getAllClients);

/**
 * @swagger
 * /api/clients/profile:
 *   get:
 *     summary: Ambil data profil client yang sedang login
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Data profil client berhasil diambil
 *       404:
 *         description: Data client tidak ditemukan
 *       500:
 *         description: Gagal mengambil data profil client
 */
router.get("/profile", verifyToken, verifyRole([CLIENT_ROLE]), getClientProfile);

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
 *       400:
 *         description: ID tidak valid
 *       404:
 *         description: Klien tidak ditemukan
 *       500:
 *         description: Gagal mengambil data klien
 */
router.get("/:id", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), getClientById);

/**
 * @swagger
 * /api/clients/profileupdate:
 *   put:
 *     summary: Perbarui data profil klien berdasarkan akun login
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
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *     responses:
 *       200:
 *         description: Data klien berhasil diperbarui
 *       404:
 *         description: Klien tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data klien
 */
router.put("/profileupdate", verifyToken, verifyRole([CLIENT_ROLE]), updateClientProfile);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Perbarui data klien berdasarkan ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68147731885820689d6b714d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - nama_lengkap
 *               - email
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "68147731885820689d6b714d"
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
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *     responses:
 *       200:
 *         description: Data klien berhasil diperbarui
 *       404:
 *         description: Klien tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data klien
 */
router.put("/:id", verifyToken, verifyRole([CLIENT_ROLE, ADMIN_ROLE]), updateClient);

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
 *       404:
 *         description: Klien tidak ditemukan
 *       500:
 *         description: Gagal menghapus data klien
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteClient);

module.exports = router;
