const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk manajemen user (register, login, reset password, delete user)
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: password
 *               role:
 *                 type: manager/admin
 *                 description: Role user (manager/admin, employee, client)
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Username atau password tidak boleh kosong
 *       500:
 *         description: Internal server error
 */
router.post("/register", userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: karyawan
 *               password:
 *                 type: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Username atau password tidak boleh kosong
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Ambil data user berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user
 *     responses:
 *       200:
 *         description: Data user ditemukan
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users/reset-password:
 *   put:
 *     summary: Reset password user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - newPassword
 *             properties:
 *               username:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Username atau newPassword tidak boleh kosong
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/reset-password", userController.resetPassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Hapus user berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", userController.deleteUser);

module.exports = router;
