const router = require("express").Router();
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const redisClient = require("../utils/redis");

const auth_schema = require("../schemas/auth.json");
router.post("/auth", validation(auth_schema), async function (req, res) {
  const reqData = req.body;
  //Check accessToken in redis first


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

  const accessToken = randToken.generate(80);
  const refreshToken = randToken.generate(80);
  const update_ref_res = await userRepo.update_ref_token(userFind.id, refreshToken);
  res.json(accessToken);
});

let update_accessToken_redis = (accessToken, data) => {
  return redisClient.set(accessToken, data);
}
let get_accessToken_redis = (accessToken) => {

}
module.exports = router;
