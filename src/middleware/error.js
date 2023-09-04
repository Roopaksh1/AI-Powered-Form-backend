const { NODE_ENV } = require('../utils/config');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: NODE_ENV === 'development' && err.stack,
  });
};

module.exports = errorHandler;
