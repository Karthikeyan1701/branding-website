import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import categoryRoutes from './routes/category.routes.js';
import subCategoryRoutes from './routes/subcategory.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';

import { errorHandler } from './middlewares/error.middleware.js';
import { generalRateLimiter } from './middlewares/rateLimiter.middleware.js';

const app = express();

const allowedOrigins = ['http://localhost:4000'];

// Global middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// Global API Rate Limiter
app.use('/api', generalRateLimiter);

// Middleware for CRUD Operations
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);

// Middleware for JWT Admin Auth Routes
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Middleware for centralized error handling
app.use(errorHandler);

export default app;
