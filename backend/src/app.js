import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
