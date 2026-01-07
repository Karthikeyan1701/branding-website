import Category from '../models/category.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId, requiredInputFields } from '../utils/validators.js';

//Helper function to generate slug

const generateSlug = (slugText) => {
  return slugText
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Create New Category
// POST /api/categories

export const createCategory = asyncHandler(async (req, res) => {
  const missing = requiredInputFields(["name"], req.body);

  if (missing.length) {
    return res.status(400).json({
        message: `Missing fields: ${missing.join(", ")}`
    });
  }

  const existingCategory = await Category.findOne({ name: req.body.name.trim() });
  if (existingCategory) {
    return res.status(409).json({ message: 'Category already exists' });
  }

  const category = await Category.create({
    name: req.body.name,
    slug: generateSlug(req.body.name),
  });

  res.status(201).json(category);
});

// Get all categories
// GET /api/categories

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
});

// Get Single Category by ID
// GET /api/categories/:id

export const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    //Validate ID Format
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    // Fetch the category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
});

// Update category
// PUT /api/categories/:id

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, isActive } = req.body;

    // Validate ID Format
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
    }

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
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
    res.status(200).json(updatedCategory);
});

// Delete category
// DELETE //api/categories/:id

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID Format
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid category ID" })
    }

    // Find the category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted successfully ' });
});
