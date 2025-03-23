const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectById,
  updateProgress
} = require("../controllers/projectController");
const { CLIENT_ROLE, ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Manajemen data Projects
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Membuat proyek baru (hanya untuk Manager/Admin)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sistem Evaluasi"
 *               description:
 *                 type: string
 *                 example: "Proyek untuk membuat sistem evaluasi"
 *               client_id:
 *                 type: string
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               employees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["650c20f2a7d1d0b9d7c8d241", "650c20f2a7d1d0b9d7c8d242"]
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-20"
 *               github_token:
 *                 type: string
 *                 example: "ghp_1234567890abcdef"
 *     responses:
 *       201:
 *         description: Proyek berhasil dibuat
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Mendapatkan daftar proyek sesuai role user
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Berhasil mengambil proyek
 */
router.get("/", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), getProjects);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: Mendapatkan detail proyek berdasarkan ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID proyek
 *     responses:
 *       200:
 *         description: Data proyek berhasil diambil
 */
router.get("/:projectId", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), getProjectById);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   put:
 *     summary: Update proyek (khusus Manager/Admin)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID proyek
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sistem Evaluasi Update"
 *               description:
 *                 type: string
 *                 example: "Deskripsi baru proyek"
 *               client_id:
 *                 type: string
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               employees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["650c20f2a7d1d0b9d7c8d241"]
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *               sdlc_progress:
 *                 type: object
 *                 properties:
 *                   analisis:
 *                     type: number
 *                     example: 20
 *                   desain:
 *                     type: number
 *                     example: 0
 *                   implementasi:
 *                     type: number
 *                     example: 0
 *                   pengujian:
 *                     type: number
 *                     example: 0
 *                   maintenance:
 *                     type: number
 *                     example: 0
 *     responses:
 *       200:
 *         description: Proyek berhasil diperbarui
 */
router.put("/:projectId", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), updateProject);


/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Menghapus proyek (khusus Manager/Admin)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID proyek
 *     responses:
 *       200:
 *         description: Proyek berhasil dihapus
 */
router.delete("/:projectId", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), deleteProject);

/**
 * @swagger
 * /api/projects/{projectId}/progress:
 *   post:
 *     summary: Update progress SDLC (khusus Karyawan)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID proyek
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               analisis:
 *                 type: number
 *                 example: 30
 *               desain:
 *                 type: number
 *                 example: 10
 *               implementasi:
 *                 type: number
 *                 example: 0
 *               pengujian:
 *                 type: number
 *                 example: 0
 *               maintenance:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Status proyek diperbarui
 */
router.post("/:projectId/progress", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), updateProgress);

module.exports = router;
