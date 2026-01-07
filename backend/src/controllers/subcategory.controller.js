import SubCategory from '../models/subcategory.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from './../utils/validators';

// Helper function to generate slug

const generateSlug = (slugText) => {
  return slugText
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Create a subcategory inside a category
// POST /api/subcategories

export const createSubCategory = asyncHandler(async (req, res) => {
  const missing = requiredInputFields(['name', 'categoryId'], req.body);
  if (missing.length) {
    return res.status(400).json({
      message: `Missing fields: ${missing.join(', ')}`,
    });
  }

  const { name, categoryId } = req.body;

  // Validate Category ID format
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({
      message: 'Invalid category ID',
    });
  }

  // Check if category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Prevent duplicate subcategory within same category
  const existingSubCategory = await SubCategory.findOne({
    name: name.trim(),
    category: categoryId,
  });

  if (existingSubCategory) {
    return res.status(409).json({
      message: 'Subcategory already exists in this category',
    });
  }

  // Create a sub category
  const subCategory = await SubCategory.create({
    name,
    slug: generateSlug(name),
    category: categoryId,
  });

  res.status(201).json(subCategory);
});

// Get all the subcategories
// GET /api/subcategories

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find()
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
  res.status(200).json(subCategories);
});

// Get subcategories by category ID
// GET /api/subcategories/category/:categoryId

export const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  //Validate ID Format
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({
      message: 'Invalid category ID',
    });
  }

  // Check if category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Fetch subcategories by category ID
  const subCategories = await SubCategory.find({
    category: categoryId,
  });

  res.status(200).json(subCategories);
});

// Update a subcategory
// PUT /api/subcategories/:id

export const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  // Validate ID Format
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid subcategory ID' });
  }

  // Find subcategory
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return res.status(404).json({
      message: 'Subcategory not found',
    });
  }

  // Update fields if provided
  if (name) {
    subCategory.name = name;
    subCategory.slug = generateSlug(name);
  }

  if (typeof isActive === 'boolean') {
    subCategory.isActive = isActive;
  }

  const updatedSubCategory = await subCategory.save();
  res.status(200).json(updatedSubCategory);
});

// Delete a subcategory
// DELETE /api/subcategories/:id

export const deleteSubCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if(!isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid subcategory ID"
        });
    }

    // Find subcategory
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({
        message: 'Subcategory not found',
      });
    }

    await subCategory.deleteOne();

    res.status(200).json({
      message: 'Subcategory deleted successfully',
    });
});
