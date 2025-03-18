const mongoose = require("mongoose");

const companyReviewSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("CompanyReview", companyReviewSchema);
