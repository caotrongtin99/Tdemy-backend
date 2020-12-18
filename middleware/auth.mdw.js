const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");

let auth_role = roles => (req, res, next) => {
  const accessToken = req.headers["x-access-token"];
  const refreshToken = req.headers["x-refresh-token"];
  if (!accessToken && roles.length > 0) {
    return res.status(400).json(response({}, 400, "Access token not valid"));
  } else {
    redisClient.hgetall(accessToken, async function (err, data) {
      // accessToken not exists
      if ((err || data === null) && roles.length !== 0) {
        logger.info("AccessToken %s not exist in redis!", accessToken);
        return res.status(400).json(response({}, 400, "Access token not valid"));
      }
      if ((err || data === null) && roles.length === 0) {
        console.log("not require");
        req.authData = {
          owner_id: null,
          email: null,
          role: -1,
          accessToken: null,
          refreshToken: null
        };
      }
      else if (data !== null) {
        const role = Number(data['role']);
        if (roles.length !== 0) {
          if (!roles.includes(role)) {
            logger.info("Role not have privileges!: ", role);
            return res.status(400).json(response({}, 400, "You do not privileges"));
          }
        }
        req.authData = {
          owner_id: data['user_id'],
          email: data['email'],
          role: role,
          accessToken: accessToken,
          refreshToken: refreshToken
        };
      }
      next();
    });
  }
};
let auth_enroll = enroll_key => (req, res, next) => {
  next();
}
module.exports = {
  auth_role,
  auth_enroll,
};
