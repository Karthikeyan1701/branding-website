import mongoose, { trusted } from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: 100
        },
        slug: {
            type: String,
            required: true,
            lowercase: true
        },
        brand: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true
        },
        externalUrl: {
            type: String,
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

// Prevent duplicate product names within same subcategory
productSchema.index({ name: 1, subcategory: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;