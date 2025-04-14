const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen pengguna (Register, Login, Reset Password, Delete User)
 */

exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Penanganan input kosong untuk registerUser (opsional jika sudah ada validasi di frontend)
        if (!username || !password) {
            return res.status(400).json({ error: 'Username atau password tidak boleh kosong' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Penanganan input kosong
        if (!username || !password) {
            return res.status(400).json({ error: 'Username atau password tidak boleh kosong' });
        }

        const user = await User.findOne({ username });
        
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        
         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

         const token = jwt.sign(
             { id: user._id, role: user.role },
             process.env.JWT_SECRET,
             { expiresIn: "1d" }
         );

         res.status(200).json({
             message: "Login successful",
             role: user.role,
             token
         });
     } catch (error) {
         console.error(error); // Untuk debugging
         res.status(500).send({ error: 'Internal server error' });
     }

};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error(error); // Untuk debugging
        res.status(500).send({ error: 'Internal server error' });
     }

};

exports.resetPassword = async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        
        // Penanganan input kosong
        if (!username || !newPassword) {
            return res.status(400).json({ error: 'Username atau newPassword tidak boleh kosong' });
        }

        const user = await User.findOne({ username });
        
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
         });
     } catch (error) {
         console.error(error); // Untuk debugging
         res.status(500).send({ error: 'Internal server error' });
     }

};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
         if (!user) return res.status(404).json({ error: "User not found" });

          res.status(200).send({
              message: "User deleted successfully"
          });
      } catch (error) {
          console.error(error); // Untuk debugging
          res.status(500).send({ error: 'Internal server error' });
      }

};
