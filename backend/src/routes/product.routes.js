import express from 'express';

import {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  updateProduct,
  deleteProduct,
} from './../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/subcategory/:subcategoryId', getProductsBySubCategory);
router.delete('/:id', deleteProduct);

export default router;
