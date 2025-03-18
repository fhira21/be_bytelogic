const express = require("express");
const { createReview, getAllReviews } = require("../controllers/reviewController");

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tambah review perusahaan
 *     tags: [Reviews]
 *     operationId: createReviews
 */
router.post("/", createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Ambil semua review perusahaan
 *     tags: [Reviews]
 *     operationId: getReviews
 */
router.get("/", getAllReviews);

module.exports = router;
