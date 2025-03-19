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
            return res.status(404).json({ message: "Manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Data manajer berhasil diambil", data: manager });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data manajer", error: error.message });
    }
};

exports.updateManager = async (req, res) => {
    try {
        const updatedManager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedManager) {
            return res.status(404).json({ message: "Manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Manajer berhasil diperbarui", data: updatedManager });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui manajer", error: error.message });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const deletedManager = await Manager.findByIdAndDelete(req.params.id);
        if (!deletedManager) {
            return res.status(404).json({ message: "Manajer tidak ditemukan" });
        }
        res.status(200).json({ message: "Manajer berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus manajer", error: error.message });
    }
};