import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subcategory name is required"],
            trim: true,
            maxlength: 50,
        },
        slug: {
            type: String,
            required: true,
            lowercase: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;