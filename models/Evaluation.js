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
    ref: "Karyawan",
    required: true
  },
  evaluation_date: {
    type: Date,
    default: Date.now
  },
  results: [
    {
      aspect_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EvaluationAspect",
        required: true
      },
      selected_criteria: {
        description: String,
        value: { type: Number, min: 1, max: 5 }
      }
    }
  ],
  final_score: {
    type: Number 
  },
  comments: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
