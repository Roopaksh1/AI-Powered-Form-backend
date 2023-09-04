const jwt = require('jsonwebtoken');
const { SECRET } = require('../../../utils/config');

const tokenGenerator = (payload) => {
  const token = jwt.sign(payload, SECRET, {
    expiresIn: '8h',
  });
  return token;
};

module.exports = tokenGenerator;
