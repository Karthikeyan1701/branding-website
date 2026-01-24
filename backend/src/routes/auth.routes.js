import express from "express";
import { loginAdmin, refreshAccessToken, logoutAdmin, getCurrentAdmin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Admin Login
router.post("/login", authRateLimiter, loginAdmin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutAdmin);
router.get("/me", protect, getCurrentAdmin);

export default router;