// routes/evaluationRoutes.js
const express = require("express");
const { createEvaluation, getAllEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } = require("../controllers/evaluationController");
const { CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE } = require("../constants/role");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Manajemen data untuk Evaluasi karyawan
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Tambah evaluasi karyawan oleh klien
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: "67dc81b352caf1a66db28d8c"
 *               employee_id:
 *                 type: string
 *                 example: "67dc876152caf1a66db28d90"
 *               scores:
 *                 type: object
 *                 properties:
 *                   quality_of_work:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *                   productivity:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 3
 *                   technical_skills:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *                   communication:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *                   discipline:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *                   initiative_and_creativity:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 4
 *                   client_satisfaction:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *               comments:
 *                 type: string
 *                 example: "Kinerja sangat baik."
 *     responses:
 *       201:
 *         description: Evaluasi berhasil ditambahkan
 */
//router.post("/", verifyToken, verifyRole([CLIENT_ROLE]), createEvaluation);
router.post("/", async (req, res) => {
    try {
      const { project_id, client_id, employee_id, results, comments } = req.body;
  
      let totalWeightedScore = 0;
      let totalWeight = 0;
      const detailedResults = [];
  
      for (const result of results) {
        const aspect = await EvaluationAspect.findById(result.aspect_id);
        if (!aspect) continue;
  
        const selected = aspect.criteria.find(c => c.score === result.selected_score);
        if (!selected) continue;
  
        const weighted = result.selected_score * aspect.weight;
  
        totalWeightedScore += weighted;
        totalWeight += aspect.weight;
  
        detailedResults.push({
          aspect_id: aspect._id,
          selected_criteria: {
            value: result.selected_score,
            description: selected.label
          }
        });
      }
  
      const finalScore = totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0;
  
      const newEvaluation = new Evaluation({
        project_id,
        client_id,
        employee_id,
        results: detailedResults,
        final_score: finalScore,
        comments
      });
  
      await newEvaluation.save();
  
      res.status(201).json({ message: "Evaluasi berhasil disimpan", evaluation: newEvaluation });
    } catch (err) {
      res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
    }
  });

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Ambil semua evaluasi
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 */
router.get("/", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), getAllEvaluations);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Ambil evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Data evaluasi berhasil diambil
 */
router.get("/:id", verifyToken, verifyRole([CLIENT_ROLE, EMPLOYEE_ROLE, ADMIN_ROLE]), getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Perbarui evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 example: 90
 *               comments:
 *                 type: string
 *                 example: "Performa meningkat."
 *     responses:
 *       200:
 *         description: Evaluasi berhasil diperbarui
 */
router.put("/:id", verifyToken, verifyRole([CLIENT_ROLE]), updateEvaluation);


/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Hapus evaluasi berdasarkan ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d8e5a7c8d24e3"
 *     responses:
 *       200:
 *         description: Evaluasi berhasil dihapus
 */
router.delete("/:id", verifyToken, verifyRole([ADMIN_ROLE]), deleteEvaluation);

module.exports = router;
