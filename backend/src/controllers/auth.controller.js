import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// Generate JWT

const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

// Admin login
// POST /api/auth/login

export const loginAdmin = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return errorResponse(res, 400, "Email and password are required");
        }

        // Check admin exists

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        // Check password

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        // Generate token

        const token = generateToken(admin._id);

        return successResponse(res, 200, "Login successful", { token });
});