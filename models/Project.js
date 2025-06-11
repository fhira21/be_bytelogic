const mongoose = require("mongoose");

const GithubCommitSchema = new mongoose.Schema({
  message: String,
  author: String,
  date: Date,
  url: String
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  framework: { type: String, required: true},
  figma: { type: String, required: true},
  status: {
    type: String,
    enum: ["Waiting List", "On Progress", "Completed"],
    default: "Waiting List"
  },
  deadline: { type: Date },
  completiondate: { type: Date },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Karyawan",required: true }],

  images: [{type: String}],

  github_repo_name: { type: String },
  github_username: { type: String },
  github_repo_url: { type: String },
  github_commits: [GithubCommitSchema],

  github_fine_grain_token: { type: String, select: false },

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
