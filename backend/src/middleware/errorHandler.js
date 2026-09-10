const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Something went wrong";

  res.status(status).json({ message });
};

export default errorHandler;
