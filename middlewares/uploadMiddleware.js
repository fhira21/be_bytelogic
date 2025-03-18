const multer = require("multer");
const path = require("path");

// Konfigurasi tempat penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Simpan di folder 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file pakai timestamp
  },
});

// Filter hanya gambar yang diizinkan
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
