const jwt = require('jsonwebtoken');
const { SECRET } = require('../../../utils/config');

const tokenGenerator = (_id) => {
  const token = jwt.sign({
    sub: _id,
    iat: Date.now(),
  }, SECRET, {
    expiresIn: '8h',
  });
  return token;
};

module.exports = tokenGenerator;
