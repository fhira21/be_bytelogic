const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getAllProjects,
  getProjectById,
  updateProgress,
  getKaryawanProjectAndEvaluation
} = require("../controllers/projectController");
const { CLIENT_ROLE, ADMIN_ROLE, EMPLOYEE_ROLE } = require("../constants/role");
const upload = require("../middlewares/uploadMiddleware")

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
 */
router.post("/", verifyToken, verifyRole([ADMIN_ROLE]), upload.array('images', 10), createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects.
 *     tags:
 *       - Projects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error fetching projects
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get('/', verifyToken, verifyRole([ADMIN_ROLE, EMPLOYEE_ROLE]), getAllProjects);

// /**
//  * @swagger
//  * /api/projects:
//  *   get:
//  *     summary: Mendapatkan daftar proyek sesuai role user
//  *     tags: [Projects]
//  *     responses:
//  *       200:
//  *         description: Berhasil mengambil proyek
//  */
// router.get("/:role", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), getProjects);

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
 *       required: false
 *       content:
 *         multipart/form-data:
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
 *               status:
 *                 type: string
 *                 enum: ["Waiting List", "On Progress", "Completed"]
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               sdlc_progress:
 *                 type: string
 *                 format: json
 *                 description: Objek progress SDLC dalam bentuk string JSON
 *                 example: '{"analisis": 20, "desain": 0, "implementasi": 0, "pengujian": 0, "maintenance": 0}'
 *               github_token:
 *                 type: string
 *                 example: "ghp_1234567890abcdef"
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
 */
router.put("/:projectId", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), upload.array('images', 10), updateProject);


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


/**
 * @swagger
 * /api/projects/karyawan/evaluations:
 *   get:
 *     summary: Mendapatkan proyek dan evaluasi yang diikuti oleh karyawan
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data proyek dan evaluasi berhasil diambil
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/karyawan/evaluations",  getKaryawanProjectAndEvaluation);

module.exports = router;
