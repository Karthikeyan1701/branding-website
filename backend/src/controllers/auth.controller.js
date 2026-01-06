import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

// Generate JWT

const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

// Admin login
// POST /api/auth/login

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Check admin exists

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check password

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate token

        const token = generateToken(admin._id);

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};