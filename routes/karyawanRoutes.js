const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const { ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const {
  createKaryawan,
  getAllKaryawan,
  getKaryawanById,
  getKaryawanProfile,
  updateKaryawanProfile,
  updateKaryawan,
  deleteKaryawan,
  getStatusKaryawan
} = require("../controllers/karyawanController");

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
 *     summary: Tambah Data Karyawan Baru
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
 *                 example: 68175c7b2a3cf69fe2681ce2
 *               nama_lengkap:
 *                 type: string
 *                 example: fhira triana maulani
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               email:
 *                 type: string
 *                 example: karyawan@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               status_karyawan:
 *                 type: string
 *                 description: status karyawan (karyawan aktif, karyawan tidak aktif, magang aktif, magang tidak aktif)
 *                 example: Karyawan Aktif
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
 *     responses:
 *       201:
 *         description: Karyawan berhasil ditambahkan
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
 * /api/karyawan/profile:
 *   get:
 *     summary: Ambil data profil manager yang sedang login
 *     tags: [Karyawan]
 *     responses:
 *       200:
 *         description: Data profil karyawan berhasil diambil
 *       404:
 *         description: Data karaywan tidak ditemukan
 *       500:
 *         description: Gagal mengambil data profil karyawan
 */
router.get("/profile", verifyToken, verifyRole(["karyawan"]), getKaryawanProfile);

/**
 * @swagger
 * /api/karyawan/statuskaryawan:
 *   get:
 *     summary: Get total status karyawan
 *     tags: [Karyawan]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan total data status karyawan
 *       500:
 *         description: Gagal mengambil data status karyawan
 */
router.get("/statuskaryawan", verifyToken, verifyRole([ADMIN_ROLE]), getStatusKaryawan);

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
 * /api/karyawan/profile/update:
 *   put:
 *     summary: Perbarui profil karyawan yang sedang login
 *     tags: [Karyawan]
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
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               email:
 *                 type: string
 *                 example: karyawan@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               status_karyawan:
 *                 type: string
 *                 description: status karyawan (karyawan aktif, karyawan tidak aktif, magang aktif, magang tidak aktif)
 *                 example: Karyawan Aktif
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
 *     responses:
 *       200:
 *         description: Profil karyawan berhasil diperbarui
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Gagal memperbarui profil karyawan
 */
router.put("/profile/update", verifyToken, verifyRole([EMPLOYEE_ROLE]), updateKaryawanProfile );

  
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
 *               nama_lengkap:
 *                 type: string
 *                 example: fhira triana maulani
 *               nik:
 *                 type: string
 *                 example: 1234567892341348
 *               email:
 *                 type: string
 *                 example: karyawan@gmail.com
 *               nomor_telepon:
 *                 type: string
 *                 example: 0898765432102
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 example: 2003-05-21
 *               jenis_kelamin:
 *                 type: string
 *                 description: jenis kelamin (laki-laki, perempuan)
 *                 example: perempuan
 *               status_pernikahan:
 *                 type: string
 *                 description: status pernikahan (menikah, belum menikah)
 *                 example: belum menikah
 *               alamat:
 *                 type: string
 *                 example: jl raya jogja-solo
 *               foto_profile:
 *                 type: string
 *                 example: "/uploads/foto.jpg"
 *               status_karyawan:
 *                 type: string
 *                 description: status karyawan (karyawan aktif, karyawan tidak aktif, magang aktif, magang tidak aktif)
 *                 example: Karyawan Aktif
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
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteKaryawan);

module.exports = router;
