import express from "express";
import cors from "cors";
import helmet from "helmet";

import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subcategory.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Middleware for category
app.use("/api/categories", categoryRoutes);

// Middleware for subcategory
app.use("/api/subcategories", subCategoryRoutes);

// Middleware for products
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
