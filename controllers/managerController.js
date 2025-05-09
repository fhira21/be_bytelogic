const Manager = require("../models/Manager");


exports.createManager = async (req, res) => {
    try {
        const manager = new Manager(req.body);
        await manager.save();
        res.status(201).json({ message: "Manajer berhasil ditambahkan", data: manager });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan manajer", error: error.message });
    }
};

exports.getAllManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        res.status(200).json({ message: "Data manajer berhasil diambil", data: managers });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data manajer", error: error.message });
    }
};

exports.getManagerById = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await Manager.findById(id);
        if (!manager) {
            return res.status(404).json({ message: "Data manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Data manajer berhasil diambil", data: manager });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data manajer", error: error.message });
    }
};


exports.getManagerProfile = async (req, res) => {
    try {
      const userId = req.user.id; // ini user_id dari token JWT
      const manager = await Manager.findOne({ user_id: userId });
  
      if (!manager) {
        return res.status(404).json({ message: "Profil manager tidak ditemukan" });
      }
  
      res.status(200).json({
        message: "Profil manager berhasil diambil",
        data: manager,
      });
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil profil manager", error: error.message });
    }
  };
  
  exports.updateManagerProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Ambil user_id dari token
      const updatedManager = await Manager.findOneAndUpdate({ user_id: userId }, req.body, { new: true });
  
      if (!updatedManager) {
        return res.status(404).json({ message: "Data manajer tidak ditemukan" });
      }
  
      res.status(200).json({ message: "Data manajer berhasil diperbarui", data: updatedManager });
    } catch (error) {
      res.status(500).json({ message: "Gagal memperbarui data manajer", error: error.message });
    }
  };  
  

exports.updateManager = async (req, res) => {
    try {
        const updatedManager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ message: "Data manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Data manajer berhasil diperbarui", data: updatedManager });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui datamanajer", error: error.message });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const deletedManager = await Manager.findByIdAndDelete(req.params.id);
        if (!deletedManager) {
            return res.status(404).json({ message: "Data manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Manajer berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data manajer", error: error.message });
    }
};