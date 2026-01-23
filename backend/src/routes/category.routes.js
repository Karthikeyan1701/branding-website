import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only creates / updates / deletes category)
router.post('/', protect, authorize("admin"),createCategory);
router.put('/:id', protect, authorize("admin"), updateCategory);
router.delete('/:id', protect, authorize("admin"), deleteCategory);

export default router;