const pino = require("pino");

module.exports = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  colorize: true,
},
 pino.destination("./serverLogs.log")
);
