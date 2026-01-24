import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  updateProduct,
  deleteProduct,
  redirectToExternalUrl,
} from './../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { objectIdSchema } from '../validators/common.validator.js';
import { productQuerySchema } from '../validators/product.query.validator.js';

const router = express.Router();

// Public routes
router.get('/', validate(productQuerySchema, 'query'), getAllProducts);
router.get(
  '/subcategory/:subcategoryId',
  validate(objectIdSchema, 'params'),
  getProductsBySubCategory,
);

//Public route - redirect user to external product link
router.get('/redirect/:id', redirectToExternalUrl);

// Protected routes (Admin only creates / deletes / updates product)
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createProductSchema),
  createProduct,
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  validate(updateProductSchema),
  updateProduct,
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validate(objectIdSchema, 'params'),
  deleteProduct,
);

export default router;
