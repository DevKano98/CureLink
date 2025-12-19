const errorHandler = (err, req, res, next) => {
  console.error(' ERROR:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    success: false
  });
};

module.exports = errorHandler;