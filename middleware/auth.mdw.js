const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");

let auth_role = roles => (req, res, next) => {
  const accessToken =  req.headers["x-access-token"];
  const refreshToken = req.headers["x-refresh-token"];
  if(!accessToken){
    return res.status(400).json(response({},400, "Access token not valid"));
  }
  if(roles.length === 0){
    req.authData = {
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    next();

  }else {
    redisClient.hgetall(accessToken, async function (err, data) {
      // accessToken not exists
      if (err || data === null) {
        logger.info("AccessToken %s not exist in redis!", accessToken);
        return res.status(400).json(response({}, 400, "Access token not valid"));
      } else {
        logger.info('AccessToken data: ', data);
        const role = Number(data['role']);
        if (!roles.includes(role)) {
          logger.info("Role not have privileges!: ", role);
          return res.status(400).json(response({}, 400, "You do not privileges"));
        }
        req.authData = {
          owner_id: data['user_id'],
          email: data['email'],
          role: role,
          accessToken: accessToken,
          refreshToken: refreshToken
        };
        next();
      }
    });
  }
};
let auth_enroll = enroll_key => (req, res, next) =>{
  next();
}
module.exports = {
  auth_role,
  auth_enroll,
};
