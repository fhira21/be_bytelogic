const mongoose = require("mongoose");

const karyawanSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  nama_lengkap: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Format email tidak valid"]
  },
  nomor_telepon: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10,15}$/, "Nomor telepon harus terdiri dari 10-15 digit angka"]
  },
  alamat: {
    type: String,
    required: true,
    trim: true
  },
  tanggal_lahir: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value <= new Date(); // Tidak boleh tanggal di masa depan
      },
      message: "Tanggal lahir tidak boleh di masa depan"
    }
  },
  jenis_kelamin: {
    type: String,
    enum: ["laki-laki", "perempuan"],
    required: true
  },
  foto_profile: {
    type: String
  },
  nik: {
    type: String,
    unique: true,
    required: true,
    match: [/^\d{16}$/, "NIK harus terdiri dari 16 digit angka"]
  },
  riwayat_pendidikan: [{
    jenjang: { type: String, required: true },
    institusi: { type: String, required: true },
    tahun_lulus: {
      type: Number,
      required: true,
      min: [1900, "Tahun lulus minimal 1900"],
      max: [new Date().getFullYear(), "Tahun lulus tidak boleh melebihi tahun sekarang"]
    }
  }],
  status_pernikahan: {
    type: String,
    enum: ["menikah", "belum menikah"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Karyawan", karyawanSchema);
