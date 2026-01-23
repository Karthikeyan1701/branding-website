import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
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
router.post("/", protect, authorize("admin"),  createSubCategory);
router.put("/:id", protect, authorize("admin"),  updateSubCategory);
router.delete("/:id", protect, authorize('admin'),  deleteSubCategory);

export default router;