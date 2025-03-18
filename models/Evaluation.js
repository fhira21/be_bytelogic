const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  communication: { type: Number, required: true, min: 1, max: 5 },
  discipline: { type: Number, required: true, min: 1, max: 5 },
  technicalSkill: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
