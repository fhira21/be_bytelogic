const express = require("express");
const { registerUser, loginUser, getUserById, resetPassword, deleteUser } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register pengguna baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: ["karyawan", "manager/admin", "client"]
 *                 example: "manager/admin"
 *     responses:
 *       201:
 *         description: Pengguna berhasil terdaftar
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Berhasil login
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Dapatkan detail pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset password pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password berhasil direset
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Hapus pengguna berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 */
router.delete("/:id", deleteUser);

module.exports = router;
