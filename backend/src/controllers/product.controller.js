import Product from '../models/product.model.js';
import SubCategory from '../models/subcategory.model.js';
import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from '../utils/validators.js';
import { buildQueryFeatures } from '../utils/queryFeatures.js';
import { generateSlug } from '../utils/slugGenerator.js';

// Create a product inside a subcategory
// POST /api/products

export const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, price, categoryId, subcategoryId, externalUrl } =
    req.body;

  // Basic validation

  const missing = requiredInputFields(
    ['name', 'price', 'categoryId', 'subcategoryId', 'externalUrl'],
    req.body
  );

  if (missing.length) {
    return res.status(400).json({
      message: `Missing fields: ${missing.join(', ')}`,
    });
  }

  // Validate ID Formats
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  if (!isValidObjectId(subcategoryId)) {
    return res.status(400).json({ message: 'Invalid subcategory ID' });
  }

  // Check category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Check subcategory exists
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  if (!subCategoryExists) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  // Prevent duplicate product in same subcategory
  const existingProduct = await Product.findOne({
    name: name.toString().trim(),
    subcategory: subcategoryId,
  });

  if (existingProduct) {
    return res.status(409).json({
      message: 'Product already exists in this subcategory',
    });
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
  res.status(201).json(product);
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

  res.status(200).json({
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
    return res.status(400).json({
      message: 'Invalid subcategory ID',
    });
  }

  // Check subcategory exists
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  if (!subCategoryExists) {
    return res.status(404).json({
      message: 'Subcategory not found',
    });
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

  res.status(200).json({
    total,
    page,
    limit,
    results: products.length,
    data: products
  });
});

// Update a product
// PUT /api/products/:id

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, brand, price, isActive, externalUrl } = req.body;

  // Validate product ID
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid product ID',
    });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
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
  res.status(200).json(updatedProduct);
});

// Delete a product
// DELETE /api/products/:id

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate product ID
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid product ID',
    });
  }

  // Delete product
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.status(200).json({ message: 'Product deleted successfully' });
});
