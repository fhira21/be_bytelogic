const express = require("express");
const { createManager, getAllManager, getManagerById } = require("../controllers/managerController");

const router = express.Router();

/**
 * @swagger
 * /api/manager:
 *   post:
 *     summary: Tambah data manajer
 *     tags: [Manager]
 *     operationId: createManager
 */
router.post("/", createManager);

/**
 * @swagger
 * /api/manager:
 *   get:
 *     summary: Ambil semua data manajer
 *     tags: [Manager]
 *     operationId: getManager
 */
router.get("/", getAllManager);

/**
 * @swagger
 * /api/manager/{id}:
 *   get:
 *     summary: Ambil data manajer berdasarkan ID
 *     tags: [Manager]
 *     operationId: getManagerId
 */
router.get("/:id", getManagerById);

module.exports = router;
