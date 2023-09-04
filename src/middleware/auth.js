const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
  logger.info("auth()")
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send({
        error: new Error("unauthorized")
      });
    }
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