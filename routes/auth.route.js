const router = require("express").Router();
const randToken = require("rand-token");
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const redisClient = require("../utils/redis");

const auth_schema = require("../schemas/auth.json");
const e = require("express");
router.post("/", validation(auth_schema), async function (req, res) {
  const reqData = req.body;

  //Check accessToken in redis first
  redisClient.hgetall(reqData.accessToken, async function (err, data) {
    // accessToken not exists
    if (err || data === null) {
      //Check reftoken
      ///
      //Reftoken not match
      let userFind = await userRepo.getByEmail(reqData.email);
      userFind = userFind[0];

      // User not found
      if (userFind === null) {
        return res.json({
          authenticated: false,
        });
      }

      // Check password
      if (!bcrypt.compareSync(reqData.password, userFind.password)) {
        return res.json({
          authenticated: false,
        });
      }
      try {
        const accessToken = randToken.generate(80);
        //   const refreshToken = randToken.generate(80);
        //   // save ref token to db
        //   const update_ref_res = await userRepo.update_ref_token(userFind.id, refreshToken);
        //   // save token to redis
        const isSaveSuccess = update_accessToken_redis(accessToken, {
          "email": userFind.email,
          "role": userFind.role
        });
        //   // save token to db
        const tokenSave = await tokenRepo.create({
            accessToken: accessToken,
            email: userFind.email
          });

        res.json(accessToken);
      } catch (err) {
        res.json("SomeThing was wrong");
      }
    } else {
      res.json(data.accessToken);
    }
  });
});

let update_accessToken_redis = (accessToken, data) => {
  return redisClient.hmset(accessToken, data, function (err, res) {
    if (err) {
      console.log(err);
    }
    // ...
  });
}

module.exports = router;
