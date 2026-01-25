import dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils/logger.js';
import { validatorEnv } from './utils/validatorEnv.js';
validatorEnv();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 4000;

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();