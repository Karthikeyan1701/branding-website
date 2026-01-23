import SubCategory from '../models/subcategory.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from '../utils/validators.js';
import { buildQueryFeatures } from '../utils/queryFeatures.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

// Create a subcategory inside a category
// POST /api/subcategories

export const createSubCategory = asyncHandler(async (req, res) => {
  const missing = requiredInputFields(['name', 'categoryId'], req.body);
  if (missing.length) {
    return errorResponse(res, 400, `Missing fields: ${missing.join(', ')}`);
  }

  const { name, categoryId } = req.body;

  // Validate Category ID format
  if (!isValidObjectId(categoryId)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  // Check if category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return errorResponse(res, 404, 'Category not found');
  }

  // Prevent duplicate subcategory within same category
  const existingSubCategory = await SubCategory.findOne({
    name: name.toString().trim(),
    category: categoryId,
  });

  if (existingSubCategory) {
    return errorResponse(
      res,
      409,
      'Subcategory already exists in this category',
    );
  }

  // Create a sub category
  const subCategory = await SubCategory.create({
    name,
    slug: generateSlug(name),
    category: categoryId,
  });

  return successResponse(res, 201, 'Subcategory created', subCategory);
});

// Get all the subcategories
// GET /api/subcategories

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const { page, limit, skip, sortBy, order } = buildQueryFeatures(req.query);

  const filter = {};

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await SubCategory.countDocuments(filter);

  const subCategories = await SubCategory.find(filter)
    .populate('category', 'name slug')
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, 'All Subcategories fetched', {
    total,
    page,
    limit,
    results: subCategories.length,
    data: subCategories,
  });
});

// Get subcategories by category ID
// GET /api/subcategories/category/:categoryId

export const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page, limit, skip, sortBy, order } = buildQueryFeatures(req.query);

  //Validate Category ID Format
  if (!isValidObjectId(categoryId)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  // Check category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return errorResponse(res, 404, 'Category not found');
  }

  const filter = { category: categoryId };

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await SubCategory.countDocuments(filter);

  const subCategories = await SubCategory.find(filter)
    .populate('category', 'name slug')
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, 'Subcategory fetched', {
    total,
    page,
    limit,
    results: subCategories.length,
    data: subCategories,
  });
});

// Update a subcategory
// PUT /api/subcategories/:id

export const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  // Validate ID Format
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid subcategory ID');
  }

  // Find subcategory
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    return errorResponse(res, 404, 'Subcategory not found');
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
  return successResponse(res, 200, 'Subcategory updated', updatedSubCategory);
});

// Delete a subcategory
// DELETE /api/subcategories/:id

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid subcategory ID');
  }

  // Find subcategory
  const subCategory = await SubCategory.findById(id);

  if (!subCategory) {
    return errorResponse(res, 404, 'Subcategory not found');
  }

  await subCategory.deleteOne();

  return successResponse(res, 200, 'Subcategory deleted successfully');
});
