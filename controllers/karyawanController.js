const Karyawan = require("../models/Karyawan");

// Ambil semua data karyawan
exports.getAllKaryawan = async (req, res) => {
  try {
    const karyawan = await Karyawan.find();
    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

// Ambil karyawan berdasarkan ID
exports.getKaryawanById = async (req, res) => {
  try {
    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

// Buat karyawan baru
exports.createKaryawan = async (req, res) => {
  try {
    const karyawanBaru = new Karyawan(req.body);
    await karyawanBaru.save();
    res.status(201).json(karyawanBaru);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan karyawan", error: error.message });
  }
};
