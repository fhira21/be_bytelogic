const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createEvaluation, getEvaluations } = require("../controllers/evaluationController");

const router = express.Router();

// ✅ Client: Berikan Evaluasi
router.post("/", protect, createEvaluation);

// ✅ Employee & Manager: Lihat Evaluasi
router.get("/", protect, getEvaluations);

module.exports = router;
