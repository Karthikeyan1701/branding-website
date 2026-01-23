import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route - Admin Login
router.post("/login", loginAdmin);

// Protected route - Get logged-in admin details
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.admin,
    });
});

export default router;