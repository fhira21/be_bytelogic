const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Pastikan path model benar

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah email ada di database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Bandingkan password dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { login };
