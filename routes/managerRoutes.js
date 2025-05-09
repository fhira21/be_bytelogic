const express = require("express");
const {
  createManager,
  getAllManagers,
  getManagerById,
  getManagerProfile,
  updateManagerProfile,
  updateManager,
  deleteManager,
} = require("../controllers/managerController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { ADMIN_ROLE } = require("../constants/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Managers
 *   description: Manajemen data Admin dan Managers
 */

/**
 * @swagger
 * /api/managers:
 *   post:
 *     summary: Tambah Data Manager Baru
 *     tags: [Managers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 68175c7b2a3cf69fe2681ce2
 *               nama_lengkap:
 *                 type: string
 *                 example: fhira triana maulani
 *               email:
 *                 type: string
 *                 example: karyawan@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               riwayat_pendidikan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - jenjang
 *                     - institusi
 *                     - tahun_lulus
 *                   properties:
 *                     jenjang:
 *                       type: string
 *                       example: S1
 *                     institusi:
 *                       type: string
 *                       example: Universitas Indonesia
 *                     tahun_lulus:
 *                       type: integer
 *                       example: 2017
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               posisi:
 *                 type: string
 *                 description: posisi (admin, manager)
 *                 example: admin
 *     responses:
 *       201:
 *         description: Managers berhasil ditambahkan
 *       500:
 *         description: Gagal menambahkan managers
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), createManager);

/**
 * @swagger
 * /api/managers:
 *   get:
 *     summary: Ambil semua data manajer
 *     tags: [Managers]
 *     responses:
 *       200:
 *         description: Data manajer berhasil diambil
 *       500:
 *         description: Gagal mengambil data manajer
 */
router.get("/", verifyToken, verifyRole([ADMIN_ROLE]), getAllManagers);

/**
 * @swagger
 * /api/managers/profile:
 *   get:
 *     summary: Ambil data profil manager yang sedang login
 *     tags: [Managers]
 *     responses:
 *       200:
 *         description: Data profil manajer berhasil diambil
 *       404:
 *         description: Data manajer tidak ditemukan
 *       500:
 *         description: Gagal mengambil data profil manajer
 */
router.get("/profile", verifyToken, verifyRole([ADMIN_ROLE]), getManagerProfile);

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
 *       404:
 *         description: data manajer tidak ditemukan
 *       500:
 *         description: Gagal mengambil data manajer
 */
router.get("/:id", verifyToken, verifyRole([ADMIN_ROLE]), getManagerById);

/**
 * @swagger
 * /api/managers/profile:
 *   put:
 *     summary: Perbarui profil manager by login
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
 *                 example: fhira triana maulani
 *               email:
 *                 type: string
 *                 example: karyawan1@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               riwayat_pendidikan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - jenjang
 *                     - institusi
 *                     - tahun_lulus
 *                   properties:
 *                     jenjang:
 *                       type: string
 *                       example: S1
 *                     institusi:
 *                       type: string
 *                       example: Universitas Indonesia
 *                     tahun_lulus:
 *                       type: integer
 *                       example: 2017
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               posisi:
 *                 type: string
 *                 description: posisi (admin, manager)
 *                 example: admin
 *     responses:
 *       200:
 *         description: Profil manager berhasil diperbarui
 *       404:
 *         description: Data manager tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data manager
 */
router.put("/profile", verifyToken, verifyRole([ADMIN_ROLE]), updateManagerProfile);

/**
 * @swagger
 * /api/managers/{id}:
 *   put:
 *     summary: Perbarui data manajer berdasarkan ID
 *     tags: [Managers]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               nama_lengkap:
 *                 type: string
 *                 example: fhira triana maulani
 *               email:
 *                 type: string
 *                 example: karyawan@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               riwayat_pendidikan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - jenjang
 *                     - institusi
 *                     - tahun_lulus
 *                   properties:
 *                     jenjang:
 *                       type: string
 *                       example: S1
 *                     institusi:
 *                       type: string
 *                       example: Universitas Indonesia
 *                     tahun_lulus:
 *                       type: integer
 *                       example: 2017
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               posisi:
 *                 type: string
 *                 description: posisi (admin, manager)
 *                 example: admin
 *     responses:
 *       200:
 *         description: Data manajer berhasil diperbarui
 *       404:
 *         description: Data manajer tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data manajer
 */
router.put("/:id", verifyToken, verifyRole([ADMIN_ROLE]), updateManager);

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
 *       404:
 *         description: data manajer tidak ditemukan
 *       500:
 *         description: Gagal menghapus data manajer
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteManager);

module.exports = router;
