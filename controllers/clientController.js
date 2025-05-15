const Client = require("../models/Client");

exports.createClient = async (req, res) => {
    try {
      const { user_id, nama_lengkap, email, nomor_telepon, alamat, foto_profile } = req.body;
  
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ message: "Email sudah terdaftar sebagai klien lain" });
      }
  
      const client = new Client({
        user_id,
        nama_lengkap,
        email,
        nomor_telepon,
        alamat,
        foto_profile,
      });
  
      await client.save();
  
      return res.status(201).json({ message: "Klien berhasil ditambahkan", data: client });
    } catch (error) {
      return res.status(500).json({ message: "Gagal menambahkan data klien", error: error.message });
    }
  };
  

  exports.getAllClients = async (req, res) => {
    try {
      const clients = await Client.find();
      const totalClients = clients.length;

      res.status(200).json({
        message: "Data klien berhasil diambil",
        totalClients: totalClients,
        data: clients,
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal mengambil data klien",
        error: error.message,
      });
    }
  };
  

exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "ID tidak valid" });
        }
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Klien tidak ditemukan" });
        }
        res.status(200).json({ message: "Data klien berhasil diambil", data: client });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data klien", error: error.message });
    }
};

exports.getClientProfile = async (req, res) => {
    try {
      const client = await Client.findOne({ user_id: req.user.id });
      if (!client) return res.status(404).json({ message: "Profil klien tidak ditemukan" });
  
      res.status(200).json({ message: "Profil klien berhasil diambil", data: client });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil profil klien", error: error.message });
    }
};
  
exports.updateClientProfile = async (req, res) => {
    try {
      const client = await Client.findOneAndUpdate(
        { user_id: req.user.id }, // cari berdasarkan user_id dari token
        req.body,
        { new: true }
      );
  
      if (!client) {
        return res.status(404).json({ message: "Profil klien tidak ditemukan" });
      }
  
      res.status(200).json({ message: "Profil klien berhasil diperbarui", data: client });
    } catch (error) {
      res.status(500).json({ message: "Gagal memperbarui profil klien", error: error.message });
    }
  };
  

exports.updateClient = async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: "Klien tidak ditemukan" });
        }
        res.status(200).json({ message: "Klien berhasil diperbarui", data: updatedClient });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui data klien", error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: "Klien tidak ditemukan" });
        }
        res.status(200).json({ message: "Klien berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus klien", error: error.message });
    }
};