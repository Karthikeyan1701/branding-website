import Category from "../models/category.model.js";

//Helper function to generate slug

const generateSlug = (slugText) => {
    return slugText.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};


// Create New Category
// POST /api/categories

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const category = await Category.create({
            name,
            slug: generateSlug(name)
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all categories
// GET /api/categories

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category
// PUT /api/categories/:id

export const updateCategory = async (req, res) => {
    try {
        const { name, isActive } = req.body;

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (name) {
            category.name = name;
            category.slug = generateSlug(name);
        }

        if (typeof isActive === "boolean") {
            category.isActive = isActive;
        }

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category
// DELETE //api/categories/:id

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.deleteOne();
        res.status(200).json({ message: "Category deleted successfully " });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
