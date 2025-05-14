const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const {
  createProject,
  getPublicProjectSummary,
  getProjectskaryawanklien,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectStatusSummary,
  getTotalProjectskaryawan,
  getProjectById,
  updateProgress
} = require("../controllers/projectController");
const { CLIENT_ROLE, ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const upload = require("../middlewares/uploadMiddleware");

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sistem Evaluasi"
 *               description:
 *                 type: string
 *                 example: "Proyek untuk membuat sistem evaluasi"
 *               framework:
 *                 type: string
 *                 example: "Be apa, Fe apa"
 *               figma:
 *                 type: string
 *                 example: "figma.com"
 *               client_id:
 *                 type: string
 *                 example: "650c20f2a7d1d0b9d7c8d24e"
 *               employees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["650c20f2a7d1d0b9d7c8d241", "650c20f2a7d1d0b9d7c8d242"]
 *               status:
 *                 type: string
 *                 enum: ["Waiting List", "On Progress", "Completed"]
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-20"
 *               github_token:
 *                 type: string
 *                 example: "ghp_1234567890abcdef"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Proyek berhasil dibuat
 *       500:
 *         description: Gagal membuat proyek
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), upload.array('images', 10), createProject);

/**
 * @swagger
 * /api/projects/summary:
 *   get:
 *     summary: Mendapatkan semua proyek landingpage
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua proyek
 *       500:
 *         description: Terjadi kesalahan saat mengambil proyek
 */
router.get("/summary", getPublicProjectSummary);

/**
 * @swagger
 * /api/projects/status-summary:
 *   get:
 *     summary: Mengambil total project by status
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan rekap status proyek.
 *       500:
 *         description: Terjadi kesalahan saat mengambil proyek.
 */
router.get("/status-summary", verifyToken, verifyRole([ADMIN_ROLE]), getProjectStatusSummary);

/**
 * @swagger
 * /api/projects/total-project:
 *   get:
 *     summary: Mendapatkan detail total project untuk dashboard karyawan
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Data proyek berhasil diambil
 *       500:
 *         description: Gagal mengambil data proyek
 */
router.get("/total-project", verifyToken, verifyRole([ADMIN_ROLE]), getTotalProjectskaryawan);

/**
 * @swagger
 * /api/projects/karyawan/klien:
 *   get:
 *     summary: Mendapatkan daftar proyek berdasarkan id (Klien atau Karyawan) yang login
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data proyek
 *       403:
 *         description: Akses tidak diijinkan
 *       500:
 *         description: Gagal mengambil data proyek
 */
router.get('/karyawan/klien', verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE]), getProjectskaryawanklien);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Mengambil semua data project dengan detail data klien dan karyawan
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil menampilkan data proyek.
 *       500:
 *         description: Terjadi kesalahan saat mengambil proyek.
 */
router.get('/', verifyToken, verifyRole([ADMIN_ROLE]), getAllProjects);

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
 *       500:
 *         description: Gagal mengambil data proyek
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
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Deskripsi baru proyek"
 *               framework:
 *                 type: string
 *                 example: "Be apa, Fe apa"
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
 *               completiondate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               status:
 *                 type: string
 *                 enum: ["Waiting List", "On Progress", "Completed"]
 *               image_to_delete:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["0", "2"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Proyek berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui data proyek
 */
router.put("/:projectId", verifyToken, verifyRole([ADMIN_ROLE]), upload.array('images', 10), updateProject);

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
 *       500:
 *         description: Gagal memperbarui data proyek
 */
router.delete("/:projectId", verifyToken, verifyRole([ADMIN_ROLE]), deleteProject);

/**
 * @swagger
 * /api/projects/{projectId}/progress:
 *   post:
 *     summary: Update progress proyek SDLC
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
 *       500:
 *         description: Gagal memperbarui data proyek
 */
router.post("/:projectId/progress", verifyToken, verifyRole([EMPLOYEE_ROLE, ADMIN_ROLE]), updateProgress);

module.exports = router;
