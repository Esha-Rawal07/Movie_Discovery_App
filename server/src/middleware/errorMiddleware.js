export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  console.error(error);

  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: error.message || "Something went wrong"
  });
};
