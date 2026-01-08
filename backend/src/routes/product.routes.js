import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  updateProduct,
  deleteProduct,
} from './../controllers/product.controller.js';
import { redirectToExternalUrl } from './../controllers/product.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/subcategory/:subcategoryId', getProductsBySubCategory);

//Public route - redirect user to external product link
router.get('/redirect/:id', redirectToExternalUrl);

// Protected routes (Admin only creates / deletes / updates product)
router.post('/', protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
