import Product from '../models/product.model.js';
import SubCategory from '../models/subcategory.model.js';
import Category from '../models/category.model.js';

// Helper function to generate slug

const generateSlug = (slugText) => {
  return slugText
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Create a product inside a subcategory
// POST /api/products

export const createProduct = async (req, res) => {
  try {
    const { name, brand, price, categoryId, subcategoryId, externalUrl } =
      req.body;

    // Basic validation
    if (!name || !price || !categoryId || !subcategoryId || !externalUrl) {
      return res.status(400).json({
        message: 'Required fields are missing',
      });
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
      name: name(trim),
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
  } catch (error) {
    res.status(500).jon({
      message: error.message,
    });
  }
};

// Get all products
// GET /api/products

export const getAllProducts = async (req, res) => {
  try {
    const products = (
      await Product.find()
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
    ).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by subcategory
// GET /api/products/subcategory/:subcategoryId
export const getProductsBySubCategory = async (req, res) => {
  try {
    const products = await Product.find({
        subcategory: req.params.subcategoryId
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid subcategory ID" });
  } 
};

// Update a product
// PUT /api/products/:id

export const updateProduct = async (req, res) => {
    try {
        const { name, brand, price, isActive } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (name) {
            product.name = name;
            product.slug = generateSlug(name);
        }

        if (brand) product.brand = brand;
        if (price !== undefined) product.price = price;
        if (typeof isActive === "boolean") product.isActive = isActive;

        const updated = await product.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Invalid product ID" });
    }
};

// Delete a product
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid product ID" });
    }
};