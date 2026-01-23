import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Admin Login
router.post("/login", authRateLimiter, loginAdmin);

// Protected route - Get logged-in admin details
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.admin,
    });
});

export default router;