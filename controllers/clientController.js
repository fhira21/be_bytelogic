const Client = require("../models/Client");

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Manajemen data klien
 */

// ✅ Tambah validasi input dan pengecekan email unik
exports.createClient = async (req, res) => {
  try {
    const { user_id, nama_lengkap, email, nomor_telepon, alamat, foto_profile } = req.body;

    // Cek apakah email sudah terdaftar
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email sudah terdaftar sebagai klien lain" });
    }

    // Buat klien baru
    const client = new Client({ user_id, nama_lengkap, email, nomor_telepon, alamat, foto_profile });
    await client.save();

    res.status(201).json({ message: "Klien berhasil ditambahkan", data: client });
  } catch (error) {
    console.error("Error menambahkan klien:", error.message);
    res.status(500).json({ message: "Gagal menambahkan klien", error: error.message });
  }
};

// ✅ Tambah logging untuk debug
exports.getAllClient = async (req, res) => {
  try {
    const clients = await Client.find();

    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "Belum ada data klien" });
    }

    res.status(200).json({ message: "Data klien berhasil diambil", data: clients });
  } catch (error) {
    console.error("Error mengambil semua klien:", error.message);
    res.status(500).json({ message: "Gagal mengambil data klien", error: error.message });
  }
};

// ✅ Perbaiki error handling untuk ID tidak valid
exports.getClientByID = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah ID valid
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Klien tidak ditemukan" });
    }

    res.status(200).json({ message: "Data klien berhasil diambil", data: client });
  } catch (error) {
    console.error("Error mengambil data klien:", error.message);
    res.status(500).json({ message: "Gagal mengambil data klien", error: error.message });
  }
};
