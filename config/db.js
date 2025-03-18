const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout jika gagal konek
    });
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
