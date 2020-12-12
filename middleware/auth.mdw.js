const redisClient = require("../utils/redis");
const logger = require("../utils/log");

let auth = function (req, res, next) {
  const reqData = req.body;
  redisClient.hgetall(reqData.accessToken, async function (err, data) {
    // accessToken not exists
    if (err || data === null) {
      logger.info("AccessToken %s not exist in redis!", reqData.accessToken);
      return res.status(400).json({
        message: "Access token not found.",
      });
    } else {
      logger.info("AccessToken data: %s", data);
      next();
    }
  });
};
module.exports = {
  auth,
};
