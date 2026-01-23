import Product from '../models/product.model.js';
import SubCategory from '../models/subcategory.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from '../utils/validators.js';
import { buildQueryFeatures } from '../utils/queryFeatures.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const isSafeUrl = (url) => url.startsWith('https://');

// Create a product inside a subcategory
// POST /api/products

export const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, price, categoryId, subcategoryId, externalUrl } =
    req.body;

  // Basic validation

  const missing = requiredInputFields(
    ['name', 'price', 'categoryId', 'subcategoryId', 'externalUrl'],
    req.body,
  );

  if (missing.length) {
    return errorResponse(res, 400, `Missing fields: ${missing.join(', ')}`);
  }

  // Validate ID Formats
  if (!isValidObjectId(categoryId)) {
    return errorResponse(res, 400, 'Invalid category ID');
  }

  if (!isValidObjectId(subcategoryId)) {
    return errorResponse(res, 400, 'Invalid subcategory ID');
  }

  // Check category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return errorResponse(res, 404, 'Category not found');
  }

  // Check subcategory exists
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  if (!subCategoryExists) {
    return errorResponse(res, 404, 'Subcategory not found');
  }

  // Prevent duplicate product in same subcategory
  const existingProduct = await Product.findOne({
    name: name.toString().trim(),
    subcategory: subcategoryId,
  });

  if (existingProduct) {
    return errorResponse(
      res,
      409,
      'Product already exists in this subcategory',
    );
  }

  // Create product
  const product = await Product.create({
    name,
    slug: generateSlug(name),
    brand,
    price,
    category: categoryId,
    subcategory: subcategoryId,
    externalUrl,
  });
  return successResponse(res, 201, 'Product created', product);
});

// Get all products
// GET /api/products

export const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip, sortBy, order } = buildQueryFeatures(req.query);

  const filter = {};

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, 'Products fetched', {
    total,
    page,
    limit,
    results: products.length,
    data: products,
  });
});

// Get products by subcategory
// GET /api/products/subcategory/:subcategoryId
export const getProductsBySubCategory = asyncHandler(async (req, res) => {
  const { subcategoryId } = req.params;
  const { page, limit, skip, sortBy, order } = buildQueryFeatures(req.query);

  // Validate ID Format
  if (!isValidObjectId(subcategoryId)) {
    return errorResponse(res, 400, 'Invalid subcategory ID');
  }

  // Check subcategory exists
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  if (!subCategoryExists) {
    return errorResponse(res, 404, 'Subcategory not found');
  }

  // Build filter
  const filter = { subcategory: subcategoryId };

  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  return successResponse(res, 200, 'Products fetched', {
    total,
    page,
    limit,
    results: products.length,
    data: products,
  });
});

// Redirect to external product link
// GET /api/products/redirect/:id

export const redirectToExternalUrl = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate product ID format
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid product ID');
  }

  const product = await Product.findById(id);

  if (!product || !product.externalUrl) {
    return errorResponse(res, 404, 'Product not found');
  }

  if (!isSafeUrl(product.externalUrl)) {
    return errorResponse(res, 400, 'Unsafe redirect blocked');
  }

  // Redirect to trusted external product link
  return res.redirect(product.externalUrl);
});

// Update a product
// PUT /api/products/:id

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, brand, price, isActive, externalUrl } = req.body;

  // Validate product ID
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  if (name) {
    product.name = name;
    product.slug = generateSlug(name);
  }

  if (brand) product.brand = brand;
  if (price !== undefined) product.price = price;
  if (typeof isActive === 'boolean') product.isActive = isActive;
  if (externalUrl) product.externalUrl = externalUrl;

  const updatedProduct = await product.save();
  return successResponse(res, 200, 'Product updated', updatedProduct);
});

// Delete a product
// DELETE /api/products/:id

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate product ID
  if (!isValidObjectId(id)) {
    return errorResponse(res, 400, 'Invalid product ID');
  }

  // Delete product
  const product = await Product.findById(id);

  if (!product) {
    return errorResponse(res, 404, 'Product not found');
  }

  await product.deleteOne();
  return successResponse(res, 200, 'Product deleted successfully');
});
