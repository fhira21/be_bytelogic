const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review tidak boleh kosong"],
  },
  client_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Client", 
    required: true },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Rating diperlukan (1-5)"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
