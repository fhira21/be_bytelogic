const Karyawan = require("../models/Karyawan");

exports.createKaryawan = async (req, res) => {
  try {
    const karyawanBaru = new Karyawan(req.body);
    await karyawanBaru.save();
    res.status(201).json(karyawanBaru);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan karyawan", error: error.message });
  }
};

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

exports.updateKaryawan = async (req, res) => {
  try {
    const updatedKaryawan = await Karyawan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedKaryawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }
    res.status(200).json({ message: "Karyawan berhasil diperbarui", data: updatedKaryawan });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui karyawan", error: error.message });
  }
};

exports.deleteKaryawan = async (req, res) => {
  try {
    const deletedKaryawan = await Karyawan.findByIdAndDelete(req.params.id);
    if (!deletedKaryawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }
    res.status(200).json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus karyawan", error: error.message });
  }
};
