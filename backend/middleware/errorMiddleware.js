export const notFound = (req, res, next) =>
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err); // ✅ Avoid double response

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
