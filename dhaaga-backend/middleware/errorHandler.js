export const notFound = (req, res) => {
  res.status(404);
  res.json({ success: false, message: `Route not found - ${req.originalUrl}` });
};

export const errorHandler = (err, req, res) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path || "resource"} identifier`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((error) => error.message).join(", ");
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "Uploaded file exceeds the 25MB limit";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
