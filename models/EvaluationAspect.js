const mongoose = require("mongoose");

const evaluationAspectSchema = new mongoose.Schema({
  aspect_name: { type: String, required: true },
  question: { type: String, required: true },
  weight: { type: Number, required: true }, // dalam persen
  criteria: [
    {
      label: { type: String, required: true },
      score: { type: Number, required: true, min: 1, max: 5 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("EvaluationAspect", evaluationAspectSchema);
