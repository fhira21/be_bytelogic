const Review = require("../models/CompanyReview");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manajemen Review Perusahaan
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tambahkan review perusahaan
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: string
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review berhasil ditambahkan
 */
exports.createReview = async (req, res) => {
  try {
    const { client_id, rating, review } = req.body;
    const newReview = new Review({ client_id, rating, review });
    await newReview.save();
    res.status(201).json({ message: "Review added successfully", newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Ambil semua review perusahaan
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Review berhasil diambil
 */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("client_id", "full_name email");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
