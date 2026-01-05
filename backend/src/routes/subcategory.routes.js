import express from 'express';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subcategory.controller.js';

const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getAllSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;