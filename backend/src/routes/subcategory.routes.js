import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subcategory.controller.js';

const router = express.Router();

// Public routes
router.get("/", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);

// Protected routes (Admin only creates / updates / deletes subcategory)
router.post("/", protect, createSubCategory);
router.put("/:id", protect, updateSubCategory);
router.delete("/:id", protect, deleteSubCategory);

export default router;