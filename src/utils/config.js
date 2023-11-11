require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB = process.env.MONGODB;
const PINO_LOG_LEVEL = process.env.PINO_LOG_LEVEL;
const SECRET = process.env.SECRET;
const NODE_ENV = process.env.NODE_ENV;
const OPEN_AI = process.env.OPEN_AI;

module.exports = {
  PORT,
  MONGODB,
  PINO_LOG_LEVEL,
  SECRET,
  NODE_ENV,
  OPEN_AI_KEY,
};
