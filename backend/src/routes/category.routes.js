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
import { validate } from '../middlewares/validate.middleware.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { paginationSchema } from '../validators/query.validator.js';

const router = express.Router();

// Public routes
router.get('/', validate(paginationSchema, 'query'), getAllCategories);
router.get('/:id', validate(objectIdSchema, 'params'), getCategoryById);

// Protected routes (admin only creates / updates / deletes category)
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createCategorySchema),
  createCategory,
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  deleteCategory,
);

export default router;
