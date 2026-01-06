import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

export default router;