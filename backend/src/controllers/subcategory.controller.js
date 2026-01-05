import SubCategory from "../models/subcategory.model.js";
import Category from "../models/category.model.js";

// Helper function to generate slug

const generateSlug = (slugText) => {
    return slugText.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

// Create a subcategory inside a category
// POST /api/subcategories

export const createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        // Validate request body
        if (!name || !categoryId) {
            return res.status(400).json({ message: "Subcategory name and category ID are required" });
        }

        // Check if category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Prevent duplicate subcategory within same category
        const existingSubCategory = await SubCategory.findOne({
            name: name.trim(),
            category: categoryId
        });

        if (existingSubCategory) {
            return res.status(409).json({
                message: "Subcategory already exists in this category"
            });
        }

        // Create a sub category
        const subCategory = await SubCategory.create({
            name,
            slug: generateSlug(name),
            category: categoryId
        });

        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all the subcategories
// GET /api/subcategories

export const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate("category", "name slug").sort({ createdAt: -1 });
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get subcategories by category ID
// GET /api/subcategories/category/:categoryId

export const getSubCategoriesByCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({
            category: req.params.categoryId
        });

        res.status(200).json(subCategories);
    } catch (error) {
        res.status(400).json({ message: "Invalid category ID" });
    }
};

// Update a subcategory
// PUT /api/subcategories/:id

export const updateSubCategory = async (req, res) => {
    try {
        const { name, isActive } = req.body;

        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        // Update fields if provided
        if (name) {
            subCategory.name = name;
            subCategory.slug = generateSlug(name);
        }

        if (typeof isActive === "boolean") {
            subCategory.isActive = isActive;
        }

        const updatedSubCategory = await subCategory.save();
        res.status(200).json(updatedSubCategory);
    } catch (error) {
        res.status(400).json({
            message: "Invalid subcategory ID"
        });
    }
};

// Delete a subcategory
// DELETE /api/subcategories/:id

export const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        await subCategory.deleteOne();

        res.status(200).json({
            message: "Subcategory deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Ivalid subcategory ID"
        });
    }
};