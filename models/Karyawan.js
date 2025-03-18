const mongoose = require("mongoose");

const karyawanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama_lengkap: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nomor_telepon: { type: String, required: true },
  alamat: { type: String, required: true },
  tanggal_lahir: { type: Date, required: true },
  jenis_kelamin: { type: String, enum: ["laki-laki", "perempuan"], required: true },
  foto_profile: { type: String },
  nik: { type: String, unique: true },
  riwayat_pendidikan: [{
    jenjang: { type: String, required: true },
    institusi: { type: String, required: true },
    tahun_lulus: { type: Number, required: true }
  }],
  status_pernikahan: { type: String, enum: ["menikah", "belum menikah"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Karyawan", karyawanSchema);
