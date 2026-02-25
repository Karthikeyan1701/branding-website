import dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils/logger.js';
import { validatorEnv } from './utils/validatorEnv.js';
import app from './app.js';
import connectDB from './config/db.js';

validatorEnv();

const PORT = process.env.PORT || 4000;

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.fatal({ err }, 'Server startup failed');
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'UNHANDLED PROMISE REJECTION');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'UNCAUGHT EXCEPTION');
  process.exit(1);
});
