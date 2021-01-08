const router = require("express").Router();
const randToken = require("rand-token");
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");
const mailModel = require("../utils/mail.model");
const login_schema = require("../schemas/register.json");
const sendMail = require("../utils/mailer");

// Authenticate gen token TODO Mục 5.1
router.post("/", validation(login_schema), async function (req, res) {
  const reqData = req.body;
  let userFind = await userRepo.getByEmail(reqData.email);
  if (userFind.length === 0) {
    return res.json(response({}, 404, "User not exists"));
  }
  userFind = userFind[0];
  if (!bcrypt.compareSync(reqData.password, userFind.password)) {
    logger.info("Password not match!");
    return res.json(response({}, 400, "Invalid credentials"));
  }
  const accessToken = randToken.generate(80);
  logger.info(`Gen accessToken ${accessToken}`);
  const isSaveSuccess = update_accessToken_redis(accessToken, {
    email: userFind.email,
    user_id: userFind.id,
    role: userFind.role,
  });
  logger.info(
    `Save accessToken into redis ${isSaveSuccess ? "success" : "fail"}`
  );

  // save access token to db
  await tokenRepo.create({
    user_id: userFind.id,
    access_token: accessToken,
    email: userFind.email,
  });
  userFind = { ...userFind.dataValues, accessToken: accessToken };
  delete userFind.password;
  res.json(response(userFind, 0, "success"));
});

// Confirm register
router.all("/confirm", async function (req, res) {
  const confirm_code = req.query.code;
  const password = req.body.password;
  if (confirm_code) {
    // Check confirm code in redis
    redisClient.hgetall(confirm_code, async function (err, data) {
      // confirm code not exists
      if (err || data === null) {
        logger.info(`Confirm code ${confirm_code} not exist in redis!`);
        return res.status(400).json(response({}, -1, "Confirm code not exits"));
      } else {
        logger.info(`Confirm code data: ${data}`);
        if (redisClient.del(confirm_code)) {
          switch (data["type"]) {
            case "register": {
              let result = await userRepo.create(data);
              logger.info("Confirm and create user success");
              result = { ...result.dataValues };
              delete result.password;
              return res
                .status(201)
                .json(response(result, 0, "Confirm success"));
            }
            case "reset_password": {
              const email = data['email'];
              if (!password || password === null || password === "null") {
                return res.json(response({}, -1, "Password is required"));
              }
              const tokens = await tokenRepo.getByEmail(email);
              for (const token of tokens) {
                redisClient.del(token.access_token);
              }
              await tokenRepo.removeByEmail(email);
              let result = await userRepo.update_password(email, password);
              logger.info(`Confirm and reset password of ${email} success`);
              return res
                .status(201)
                .json(response(result, 0, "Confirm success"));
            }
          }
        } else {
          logger.error("Remove confirm code redis fail");
          return res.status(500).json(response({}, -1, "something wrong"));
        }
      }
    });
  } else {
    logger.error("Confirm fail");
    res.json(response({}, -1, "confirm not valid"));
  }
});

// Forgot password -> send mail
const forgot_schema = require("../schemas/forgot.json");
router.post("/forgot", validation(forgot_schema), async function (req, res) {
  const email = req.body.email;
  try {
    if (email) {
      const isExist = await userRepo.isEmailExist(email);
      if (isExist) {
        const confirm_code = "fg" + randToken.generate(80);
        const cacheCode = redisClient.hmset(confirm_code, {
          email: email,
          type: "reset_password",
        });
        const expireTime = redisClient.expire(
          confirm_code,
          process.env.CONFIRM_EXP || 86400
        );
        if (cacheCode && expireTime) {
          logger.info("Create confirm code for reset password");
          sendMail(mailModel.forget_message(email, confirm_code));
          return res.json(
            response({}, 0, "Please check your mail to reset your password")
          );
        }
        throw "Save redis fail";
      } else {
        logger.error("Forgot email fail: email not exist");
        return res.json(response({}, 404, "email not exist"));
      }
    } else {
      logger.error("Forgot password fail");
      res.json(response({}, -1, "email not valid"));
    }
  } catch (e) {
    logger.error("Forgot pass fail: ", e);
    return res.json(response({}, -1, "something was wrong"));
  }
});

let update_accessToken_redis = (accessToken, data) => {
  let isSet = redisClient.hmset(accessToken, data);
  let isSetExpire = redisClient.expire(
    accessToken,
    process.env.ACCESS_TOKEN_EXPIRE || 60
  );
  return isSet && isSetExpire;
};

module.exports = router;
