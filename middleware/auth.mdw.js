const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");

let auth_role = role => (req, res, next) => {
  const reqData = req.body;
  redisClient.hgetall(reqData.accessToken, async function (err, data) {
    // accessToken not exists
    if (err || data === null) {
      logger.info("AccessToken %s not exist in redis!", reqData.accessToken);
      return res.status(400).json(response({},400, "Access token not valid"));
    } else {
      logger.info("AccessToken data: %s", data);
      if(!role.includes(data.role)){
        logger.info("Role [%s] not have privileges!", data.role);
        return res.status(400).json(response({},400, "You do not privileges"));
      }
      next();
    }
  });
};
let auth_enroll = enroll_key => (req, res, next) =>{
  next();
}
module.exports = {
  auth_role,
  auth_enroll,
};
