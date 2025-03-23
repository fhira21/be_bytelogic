const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Pastikan model User tersedia
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Akses ditolak. Token tidak tersedia." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    console.log("User Data:", User);
    console.log("Decoded Token:", req.user); // Tambahkan ini untuk melihat isi token
    next();
  } catch (err) {
    res.status(400).json({ message: "Token tidak valid." });
  }
};


exports.verifyRole = (roles) => async (req, res, next) => {
  try {
    // Pastikan `req.user` sudah diisi oleh verifyToken
    console.log(req.user)
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Akses ditolak. User tidak ditemukan." });
    }

    const user = await User.findById(req.user.id);
    console.log("User ditemukan:", user);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Akses ditolak. Anda tidak memiliki izin." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat verifikasi peran.", error: error.message });
  }
};
