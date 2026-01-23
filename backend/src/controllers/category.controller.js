import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from '../utils/validators.js';
import { buildQueryFeatures } from './../utils/queryFeatures.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

// Create New Category
// POST /api/categories

export const createCategory = asyncHandler(async (req, res) => {
  const missing = requiredInputFields(['name'], req.body);
  if (missing.length) {
    return errorResponse(res, 400, `Missing fields: ${missing.join(', ')}`);
  }

  const existingCategory = await Category.findOne({
    name: req.body.name.toString().trim(),
  });
  if (existingCategory) {
    return errorResponse(res, 409, 'Category already exists');
  }

  const category = await Category.create({
    name: req.body.name,
    slug: generateSlug(req.body.name),
  });

  return successResponse(res, 201, 'Category created', category);
});

// Get all categories
// GET /api/categories

export const getAllCategories = asyncHandler(async (req, res) => {
  const { page, limit, skip, sortBy, order } = buildQueryFeatures(req.query);

  const filter = {};

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, 'Categories fetched', {
    total,
    page,
    limit,
    results: categories.length,
    data: categories,
  });
});

// Get Single Category by ID
// GET /api/categories/:id

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //Validate ID Format
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  // Fetch the category
  const category = await Category.findById(id);

  if (!category) {
    return errorResponse(res, 404, 'Category not found');
  }

  return successResponse(res, 200, 'Category fetched', category);
});

// Update category
// PUT /api/categories/:id

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  // Validate ID Format
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  // Find category
  const category = await Category.findById(id);
  if (!category) {
    return errorResponse(res, 404, 'Category not found');
  }

  // Update category fields
  if (name) {
    category.name = name;
    category.slug = generateSlug(name);
  }

  if (typeof isActive === 'boolean') {
    category.isActive = isActive;
  }

  const updatedCategory = await category.save();
  return successResponse(res, 200, 'Category updated', updatedCategory);
});

// Delete category
// DELETE /api/categories/:id

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID Format
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  // Find the category
  const category = await Category.findById(id);

  if (!category) {
    return errorResponse(res, 404, 'Category not found');
  }

  await category.deleteOne();
  return successResponse(res, 200, 'Category deleted successfully');
});
