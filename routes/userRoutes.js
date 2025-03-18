const express = require("express");
const { registerUser, loginUser, getUserById } = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register pengguna baru
 *     tags: [Users]
 *     operationId: registerUser
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users]
 *     operationId: loginUser
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Ambil user berdasarkan ID
 *     tags: [Users]
 *     operationId: readUserId
 */
router.get("/:id", getUserById);

module.exports = router;
