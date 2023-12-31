require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB = process.env.MONGODB;
const PINO_LOG_LEVEL = process.env.PINO_LOG_LEVEL;
const SECRET = process.env.SECRET;
const NODE_ENV = process.env.NODE_ENV;
const ADMIN_PASS = process.env.ADMIN_PASS;

module.exports = {
  PORT,
  MONGODB,
  PINO_LOG_LEVEL,
  SECRET,
  NODE_ENV,
  ADMIN_PASS,
};
