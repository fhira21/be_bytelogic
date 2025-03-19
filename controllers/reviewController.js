const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { review, client_id, rating } = req.body;

    if (!review || !client_id || !rating) {
      return res.status(400).json({ message: "Semua field (review, client_id, rating) harus diisi" });
    }

    const newReview = new Review({ review, client_id, rating });
    await newReview.save();

    res.status(201).json({ message: "Review berhasil ditambahkan", newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("client_id", "name"); // Mengambil nama klien juga
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Pastikan kedua fungsi ini diekspor dengan benar
module.exports = {
  createReview,
  getAllReviews,
};
