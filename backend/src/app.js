import express from "express";
import cors from "cors";
import helmet from "helmet";

import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subcategory.routes.js";
import productRoutes from "./routes/product.routes.js";

import authRoutes from "./routes/auth.routes.js"

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Middleware for CRUD Operations
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);

// Middleware for JWT Admin Auth Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
