const express = require("express");
const { registerUser, loginUser, getUserById } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen pengguna (Register, Login, Get User)
 */

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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["karyawan", "manager", "client"]
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
 *               password:
 *                 type: string
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
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 */
router.get("/:id", getUserById);

module.exports = router;
