const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["manager/admin", "client", "karyawan"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
