const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
  logger.info("auth()")
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, process.env.TOKEN);
    const userId = await decodedToken.userId;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};