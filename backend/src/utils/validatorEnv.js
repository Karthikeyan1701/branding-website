import { logger } from './logger.js';

export const validatorEnv = () => {
  const required = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'NODE_ENV',
  ];

  // Find missing variables
  const missing = required.filter((key) => !process.env[key]);

  // Stop the server if anything is missing
  if (missing.length > 0) {
    logger.error({ missing }, 'Missing required environment variables:');
    process.exit(1);
  }

  // Warn if NODE_ENV value is unexpected
  const allowedEnvs = ['development', 'production', 'test'];

  if (!allowedEnvs.includes(process.env.NODE_ENV)) {
    logger.warn(
      `NODE_ENV "${process.env.NODE_ENV}" is not standard (development | production | test)`,
    );
  }

  logger.info('Environment variables validated successfully');
};
