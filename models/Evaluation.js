const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  evaluation_date: {
    type: Date,
    default: Date.now
  },
  scores: {
    quality_of_work: { type: Number, min: 1, max: 5, required: true },
    productivity: { type: Number, min: 1, max: 5, required: true },
    technical_skills: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    discipline: { type: Number, min: 1, max: 5, required: true },
    initiative_and_creativity: { type: Number, min: 1, max: 5, required: true },
    client_satisfaction: { type: Number, min: 1, max: 5, required: true }
  },
  final_score: { type: Number },
  comments: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
