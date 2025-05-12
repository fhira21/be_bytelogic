const Review = require("../models/Review");
const Client = require("../models/Client");

exports.createReview = async (req, res) => {
    try {
      if (req.user.role !== "client") {
        return res.status(403).json({ message: "Hanya klien yang dapat memberikan review." });
      }
  
      const client = await Client.findOne({ user_id: req.user.id });
  
      if (!client) {
        return res.status(404).json({ message: "Data klien tidak ditemukan." });
      }
  
      const { review, rating } = req.body;

      const newReview = await Review.create({
        review,
        rating,
        client_id: client._id,
      });
  
      res.status(201).json({
        message: "Review berhasil dibuat",
        data: newReview,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat review", error });
    }
  };

exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 } // Urutkan dari bintang 5 ke 1
      }
    ]);

    const total = await Review.countDocuments();
    const avgResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    // Buat struktur data untuk masing-masing bintang (1-5)
    const stars = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    stats.forEach(item => {
      stars[item._id] = item.count;
    });

    res.status(200).json({
      message: "Statistik review berhasil diambil",
      totalReviews: total,
      averageRating: avgResult[0]?.averageRating?.toFixed(2) || "0.00",
      ratings: stars
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil statistik review",
      error: error.message
    });
  }
};

exports.getAllReviews = async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("client_id", "nama_lengkap foto_profile") // ambil nama dan foto profil dari Client
        .sort({ createdAt: -1 }); // urutkan dari yang terbaru (opsional)
  
      res.status(200).json({
        message: "Data review berhasil diambil",
        data: reviews,
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal mengambil data review",
        error: error.message,
      });
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

exports.getMyReviews = async (req, res) => {
  try {
    // Dapatkan ID user dari token (diset oleh middleware autentikasi)
    const userId = req.user.id;

    // Cari data client berdasarkan user_id
    const client = await Client.findOne({ user_id: userId });

    if (!client) {
      return res.status(404).json({ message: "Client tidak ditemukan" });
    }

    // Ambil semua review milik client tersebut
    const reviews = await Review.find({ client_id: client._id }).populate("client_id", "nama_lengkap");

    res.status(200).json({
      message: "Review milik user berhasil diambil",
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil review milik user",
      error: error.message
    });
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

exports.updateMyReview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Cari client berdasarkan user yang login
    const client = await Client.findOne({ user_id: userId });
    if (!client) {
      return res.status(404).json({ message: "Client tidak ditemukan" });
    }

    // Cari dan update review berdasarkan client_id
    const updatedReview = await Review.findOneAndUpdate(
      { client_id: client._id },
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review tidak ditemukan untuk client ini" });
    }

    res.status(200).json({
      message: "Review berhasil diperbarui",
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui review",
      error: error.message
    });
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