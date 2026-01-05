import express from "express";
import cors from "cors";
import helmet from "helmet";

import categoryRoutes from './routes/category.routes.js';

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Middlewares for category
app.use("/api/categories", categoryRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});



export default app;
