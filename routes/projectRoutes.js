const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectStatus
} = require("../controllers/projectController");

const router = express.Router();

// ✅ Manager: Buat Proyek
router.post("/", protect, createProject);

// ✅ Semua User: Lihat Semua Proyek
router.get("/", protect, getProjects);

// ✅ Manager: Edit Proyek
router.put("/:projectId", protect, updateProject);

// ✅ Manager: Hapus Proyek
router.delete("/:projectId", protect, deleteProject);

// ✅ Karyawan: Perbarui Status Proyek
router.patch("/:projectId/status", protect, updateProjectStatus);

module.exports = router;
