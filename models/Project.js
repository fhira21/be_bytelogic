const mongoose = require("mongoose");

const GithubCommitSchema = new mongoose.Schema({
  message: String,
  author: String,
  date: Date,
  url: String
}, { _id: false });

const SDLCProgress = new mongoose.Schema({
  analisis: { type: Number, default: 0 }, // dalam persentase (%)
  desain: { type: Number, default: 0 },
  implementasi: { type: Number, default: 0 },
  pengujian: { type: Number, default: 0 },
  maintenance: { type: Number, default: 0 },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Perancangan", "Pengembangan", "Selesai"],
    default: "Perancangan"
  },
  deadline: { type: Date },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  github_repo_name: { type: String },
  github_username: { type: String },
  github_repo_url: { type: String },
  github_commits: [GithubCommitSchema],

  github_fine_grain_token: { type: String, select: false },

  sdlc_progress: SDLCProgress,

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
