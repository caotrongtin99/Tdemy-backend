const router = require("express").Router();
const randToken = require("rand-token");
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const redisClient = require("../utils/redis");
const logger = require("../utils/log");
const response = require("../constants/response");
const auth_schema = require("../schemas/auth.json");
router.post("/", validation(auth_schema), async function (req, res) {
  const reqData = req.body;

  // check accessToken in redis first
  redisClient.hgetall(reqData.accessToken, async function (err, data) {
    // accessToken not exists
    if (err || data === null) {
      logger.info("AccessToken %s not exist in redis!", reqData.accessToken);
      // find user
      let userFind = await userRepo.getByEmail(reqData.email);
      // uer not found
      if (userFind.length == 0) {
        logger.info("User %s not exist!", reqData.email);
        return res.json(response({}, 409, "User not exist"));
      }

      try {
        // found
        userFind = userFind[0];
        // check ref_token valid
        if (userFind.ref_token === reqData.refreshToken) {
          logger.info("Ref token: %s valid!", reqData.ref_token);
          const accessToken = randToken.generate(80);
          logger.info("Gen accessToken %s", accessToken);
          const isSaveSuccess = update_accessToken_redis(accessToken, {
            email: userFind.email,
            role: userFind.role,
          });
          logger.info(
            "Save accessToken into redis %s",
            isSaveSuccess ? "success" : "fail"
          );
          // save access token to db
          const tokenSave = await tokenRepo.create({
            access_token: accessToken,
            email: userFind.email,
          });
          return res.json(
            response(
              {
                accessToken: accessToken,
              },
              0,
              "success"
            )
          );
        }

        // ref token not match
        // check password
        if (!bcrypt.compareSync(reqData.password, userFind.password)) {
          logger.info("Password not match!");
          return res.json(response({}, 400, "Invalid credentials"));
        }

        const accessToken = randToken.generate(80);
        logger.info("Gen accessToken %s", accessToken);
        const refreshToken = randToken.generate(80);
        logger.info("Gen refreshToken %s", accessToken);
        // save ref token to db
        const isUpdateRef = await userRepo.update_ref_token(
          userFind.id,
          refreshToken
        );
        // save token to redis
        const isSaveSuccess = update_accessToken_redis(accessToken, {
          email: userFind.email,
          role: userFind.role,
        });
        logger.info(
          "Save accessToken into redis %s",
          isSaveSuccess ? "success" : "fail"
        );

        // save access token to db
        const tokenSave = await tokenRepo.create({
          access_token: accessToken,
          email: userFind.email,
        });
        res.json(accessToken);
      } catch (err) {
        res.json("SomeThing was wrong");
      }
    } else {
      logger.info("accessToken valid!");
      res.json(
        response(
          {
            accessToken: data.accessToken,
          },
          0,
          "success"
        )
      );
    }
  });
});

let update_accessToken_redis = (accessToken, data) => {
  return redisClient.hmset(accessToken, data);
};

module.exports = router;
