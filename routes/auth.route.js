const router = require("express").Router();
const bcrypt = require("bcryptjs");
const validation = require("../middleware/validation.mdw");
const userRepo = require("../repository/user.repo");
const redisClient = require("../utils/redis");

router.post("/auth", validation(), async function (req, res) {
  const reqData = req.body;
  const userFind = await userRepo.getByEmail(reqData.email);
  // User not found
  if (userFind === null) {
    return res.json({
      authenticated: false,
    });
  }
  // Check password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.json({
      authenticated: false,
    });
  }

    const accessToken = randToken.generate(80);
    const refreshToken = randToken.generate(80);
    await userRepo.update_ref_token(userFind.id, refreshToken);
    redisClient;
});

module.exports = router;
