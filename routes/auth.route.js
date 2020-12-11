const router = require("express").Router();
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const redisClient = require("../utils/redis");

const auth_schema = require("../schemas/auth.json");
router.post("/auth", validation(auth_schema), async function (req, res) {
  const reqData = req.body;
  //Check accessToken in redis first
  const redisToken = get_accessToken_redis(req.accessToken);

  //If accessToken Null or expire then use Login
  const userFind = await userRepo.getByEmail(reqData.email);
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
    const refreshToken = randToken.generate(80);
    // save ref token to db
    const update_ref_res = await userRepo.update_ref_token(userFind.id, refreshToken);
    // save token to redis
    const update_redis_token = update_accessToken_redis(accessToken, {
      "email": userFind.email,
      "role": userFind.role
    });
    // save token to db
    await tokenRepo.create({
      accessToken: accessToken,
      email: userFind.email
    });

    res.json(accessToken);
  } catch (err) {
    return res.json("Somethings was wrong");
  }
});

let update_accessToken_redis = (accessToken, data) => {
  return redisClient.hmset(accessToken, data);
}
let get_accessToken_redis = (accessToken) => {
  return redisClient.hgetall(accessToken);
}
module.exports = router;
