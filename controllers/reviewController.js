const Review = require("../models/Review");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manajemen review perusahaan
 */

exports.createReview = async (req, res) => {
    try {
        const { review, client_id, rating } = req.body;

        if (!review || !client_id || !rating) {
            return res.status(400).json({ message: "Semua field (review, client_id, rating) harus diisi" });
        }

        const newReview = new Review({ review, client_id, rating });
        await newReview.save();

        res.status(201).json({ message: "Review berhasil ditambahkan", data: newReview });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan review", error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate("client_id", "name");
        res.status(200).json({ message: "Data review berhasil diambil", data: reviews });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data review", error: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate("client_id", "name");
        if (!review) {
            return res.status(404).json({ message: "Review tidak ditemukan" });
        }
        res.status(200).json({ message: "Data review berhasil diambil", data: review });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data review", error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "Review tidak ditemukan" });
        }
        res.status(200).json({ message: "Review berhasil diperbarui", data: updatedReview });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui review", error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review tidak ditemukan" });
        }
        res.status(200).json({ message: "Review berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus review", error: error.message });
    }
};