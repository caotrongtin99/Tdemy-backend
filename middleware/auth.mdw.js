const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");

let auth_role = roles => (req, res, next) => {
  if(!req.body.accessToken){
    return res.status(400).json(response({},400, "Access token not valid"));
  }
  const reqData = req.body;
  redisClient.hgetall(reqData.accessToken, async function (err, data) {
    // accessToken not exists
    if (err || data === null) {
      logger.info("AccessToken %s not exist in redis!", reqData.accessToken);
      return res.status(400).json(response({},400, "Access token not valid"));
    } else {
      logger.info('AccessToken data: ', data);
      const role = Number(data['role']);
      if(!roles.includes(role)){
        logger.info("Role not have privileges!: ", role);
        return res.status(400).json(response({},400, "You do not privileges"));
      }
      req.authData= {
        owner_id: data['user_id'],
        role: role
      };
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
