import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from './../utils/token.js';

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
        if (!admin || !(await admin.comparePassword(password))) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        const accessToken = generateAccessToken({
            id: admin._id,
            role: admin.role,
        });

        const refreshToken = generateRefreshToken({
            id: admin._id,
        });

        admin.refreshTokens.push({ token: refreshToken });
        await admin.save();

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 200, "Login successful", { accessToken });
});

// REFRESH ACCESS TOKEN

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return errorResponse(res, 401, "Refresh token missing");
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
        return errorResponse(res, 401, "Invalid refresh token");
    }

    const exists = admin.refreshTokens.some(
        (t) => t.token === refreshToken
    );

    if (!exists) {
        return errorResponse(res, 401, "Refresh token revoked");
    }

    return successResponse(res, 200, "Access token refreshed", {
        accessToken: newAccessToken,
    });
});

// LOG OUT

export const logoutAdmin = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const admin = await Admin.findOne({
            "refreshTokens.token": refreshToken,
        });

        if (admin) {
            admin.refreshTokens = admin.refreshTokens.filter(
                (t) => t.token !== refreshToken
            );
            await admin.save();
        }
    }

    res.clearCookie("refreshToken");

    return successResponse(res, 200, "Logged out successfully");
});

// CURRENT ADMIN

export const getCurrentAdmin = asyncHandler(async (req, res) => {
    return successResponse(res, 200, "Admin fetched successfully", req.user);
});