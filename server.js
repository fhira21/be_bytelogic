const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerDocs = require("./swagger");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const managerRoutes = require("./routes/managerRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());


// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Swagger Docs
swaggerDocs(app);

// Route Utama untuk Pengecekan Server
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Railway!");
});

// Route Pengujian API
app.get("/api/test", (req, res) => {
  res.json({ message: "🚀 API is working properly!" });
});

// Menggunakan Routes
app.use("/api/users", userRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
