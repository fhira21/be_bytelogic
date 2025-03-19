const express = require("express");
const mongoose = require("mongoose");
const swaggerDocs = require("./swagger");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const managerRoutes = require("./routes/managerRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const path = require("path");

const app = express();
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Swagger Docs
swaggerDocs(app);

// Menggunakan Routes
app.use("/api/users", userRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/evaluations", evaluationRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
