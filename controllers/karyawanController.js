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
    res.status(200).json({
      message: "Berhasil menampilkan data karyawan",
      data: karyawan});
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

// Ambil karyawan berdasarkan ID
exports.getKaryawanById = async (req, res) => {
  try {
    const karyawan = await Karyawan.findById(req.params.id);
    if (!karyawan) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    res.status(200).json({
      message: "Berhasil menampilkan data karyawan",
      data: karyawan});
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

exports.getKaryawanProfile = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({ user_id: req.user.id }); // Ambil dari token
    if (!karyawan) return res.status(404).json({ message: "Profil karyawan tidak ditemukan" });

    res.status(200).json({ message: "Profil karyawan berhasil diambil", data: karyawan });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil profil karyawan", error: error.message });
  }
};

exports.updateKaryawanProfile = async (req, res) => {
  try {
    const karyawanId = req.user.id;

    const updatedKaryawan = await Karyawan.findOneAndUpdate(
      { user_id: karyawanId },
      req.body,
      { new: true }
    );

    if (!updatedKaryawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    res.status(200).json({
      message: "Profil karyawan berhasil diperbarui",
      data: updatedKaryawan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui profil karyawan",
      error: error.message,
    });
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

exports.getStatusKaryawan = async (req, res) => {
  try {
    const statusCounts = await Karyawan.aggregate([
      {
        $group: {
          _id: "$status_Karyawan",
          jumlah: { $sum: 1 }
        }
      }
    ]);

    // Inisialisasi semua status ke 0
    const result = {
      "Karyawan Aktif": 0,
      "Karyawan Tidak Aktif": 0,
      "Magang Aktif": 0,
      "Magang Tidak Aktif": 0
    };

    // Update berdasarkan hasil query
    statusCounts.forEach(item => {
      result[item._id] = item.jumlah;
    });

    // Hitung total semua karyawan
    const totalKaryawan = Object.values(result).reduce((acc, val) => acc + val, 0);

    res.status(200).json({
      message: "Berhasil mendapatkan data status karyawan",
      success: true,
      totalKaryawan: totalKaryawan,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data status karyawan",
      error: error.message
    });
  }
};
