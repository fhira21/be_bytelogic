const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama_lengkap: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nomor_telepon: { type: String, required: true },
  alamat: { type: String, required: true },
  foto_profile: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Client", ClientSchema);
