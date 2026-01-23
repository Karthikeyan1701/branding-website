export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log stack only in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
