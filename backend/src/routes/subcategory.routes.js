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
import { validate } from '../middlewares/validate.middleware.js';
import { createSubcategorySchema, updateSubcategorySchema } from '../validators/subcategory.validator.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { z } from "zod";

const router = express.Router();

// Public routes
router.get('/', getAllSubCategories);
router.get(
  '/category/:categoryId',
  validate(z.object({
    categoryId: objectIdSchema.shape.id,
  }), 'params'),
  getSubCategoriesByCategory,
);

// Protected routes (Admin only creates / updates / deletes subcategory)
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createSubcategorySchema),
  createSubCategory,
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  validate(updateSubcategorySchema),
  updateSubCategory,
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  deleteSubCategory,
);

export default router;
