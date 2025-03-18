const express = require("express");
const { createKaryawan, getAllKaryawan, getKaryawanById } = require("../controllers/karyawanController");

const router = express.Router();

/**
 * @swagger
 * /api/karyawan:
 *   post:
 *     summary: Tambah data karyawan
 *     tags: [Karyawan]
 *     operationId: createKaryawan
 */
router.post("/", createKaryawan);

/**
 * @swagger
 * /api/karyawan:
 *   get:
 *     summary: Ambil semua data karyawan
 *     tags: [Karyawan]
 *     operationId: getKaryawan
 */
router.get("/", getAllKaryawan);

/**
 * @swagger
 * /api/karyawan/{id}:
 *   get:
 *     summary: Ambil data karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     operationId: getKaryawanId
 */
router.get("/:id", getKaryawanById);

module.exports = router;
