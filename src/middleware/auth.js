const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { SECRET } = require('../utils/config');
const asyncHandler = require('express-async-handler');
const User = require('../db/models/userModel');

module.exports = asyncHandler(async (req, res, next) => {
  logger.info('auth()');
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error('Unauthorized');
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (err) {
    res.status(401);
    throw new Error(err.message);
  }
  const user = await User.findById(decodedToken.sub);
  req.user = user;
  next();
});
