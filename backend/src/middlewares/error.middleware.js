import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error stack only in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(
      {
        statusCode,
        path: req.originalUrl,
        method: req.method,
      },
      message
    );
  } else {
    logger.error(
      {
        statusCode,
        path: req.originalUrl,
        method: req.method,
        stack: err.stack,
      },
      message
    );
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...err(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};
