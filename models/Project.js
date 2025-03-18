const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  framework: { type: String, required: true },
  link: { type: String },
  image: { type: String },
  status: {
    type: String,
    enum: ["Perancangan", "Pengembangan", "Selesai"],
    default: "Perancangan"
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
