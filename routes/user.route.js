const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const randToken = require("rand-token");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const logger = require("../utils/log");
const bcrypt = require("bcryptjs");
const auth_role = require("../middleware/auth.mdw").auth_role;
const redisClient = require("../utils/redis");
const sendMail = require("../utils/mailer");

// Get list user TODO Mục 4.3
router.get("/", auth_role([2]), async function (req, res) {
  try {
    const users = await userRepo.getAll();
    res.json(response(users, 0, "success"));
  } catch (e) {
    logger.error(`Get Users error: ${e}`);
    res.json(response({}, -1, "something wrong"));
  }
});

// Change password TODO Mục 5.3
const change_pass = require("../schemas/change_pass.json");
router.post("/changepassword", auth_role([0, 1, 2]), validation(change_pass), async function (req, res){
  const reqData = req.body;
  const authData = req.authData;
  const email = authData.email;
  try{
        const user = await userRepo.getByEmail(email);
        if(user){
          if (!bcrypt.compareSync(reqData.old_password, user.password)) {
            logger.info("Password not match!");
            return res.json(response({}, 400, "Invalid credentials"));
          }
          const isSuccess = await userRepo.update_password(email, reqData.new_password);
          return res.json(response(isSuccess, 0, "success"));
        }
        logger.info(`Change password fail: user ${email} not exist`);
        throw 'User Not Exist';
    }catch (e) {
      logger.info(`Change password error ${e}`);
      return res.json(response({}, 500, "something wrong"))
    }
})
// Register route TODO Mục 1.6, 4.3
const register_schema = require("../schemas/register.json");
const register_mail = require("../utils/mail.model").register_message;
router.post("/", validation(register_schema), async function (req, res) {
  const user = req.body;
  try {
    const userFind = await userRepo.getByEmail(user.email);
    console.log(userFind);
    if (userFind.length !== 0) {
      return res.json(response({}, 409, "email exist"));
    }
    if (process.env.DEBUG === "true") {
      let result = await userRepo.create(user);
      result = { ...result.dataValues };
      delete result.password;
      return res.json(response(result, 0, "success"));
    } else {
      const confirm_code = "uc" + randToken.generate(80);
      const cacheCode = redisClient.hmset(confirm_code, {
        ...user,
        type: "register",
      });
      const expireTime = redisClient.expire(
        confirm_code,
        process.env.CONFIRM_EXP || 86400
      );
      if (cacheCode && expireTime) {
        logger.info("Create confirm code");
        sendMail(register_mail(user.email, confirm_code));
        return res.json(
          response({}, 0, "Please check your mail and confirm register")
        );
      }
      throw "Save confirm redis fail";
    }
  } catch (e) {
    logger.error(`Register error: ${e}`);
    res.json(response({}, -1, "something wrong"));
  }
});

// Get detail TODO Mục 4.3
router.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const result = await userRepo.getById(id);
    res.json(response(result, 0, "success"));
  } catch (e) {
    logger.error(`Get user detail error: ${e}`);
    res.json(response({}, -1, "something wrong"));
  }
});

// Update TODO Mục 2.2, 3.3, 4.3, 5.2
const update_schema = require("../schemas/update_user.json");
router.put(
  "/:id",
  auth_role([0, 1]),
  validation(update_schema),
  async function (req, res) {
    const id = req.params.id;
    const data = req.body;
    const authData = req.authData;
    try {
      const user = userRepo.getById(id);
      if (user && id === authData.owner_id) {
        if (req.body.role) {
          redisClient.del(req.headers["x-access-token"]);
        }
        const result = await userRepo.update(id, data);
        return res.json(response(result, 0, "success"));
      } else {
        logger.info("Update user not permission");
        return res.json(response({}, 400, "You do not have permission"));
      }
    } catch (e) {
      logger.error(`Update user error: ${e}`);
      return res.json(response({}, -1, "something wrong"));
    }
  }
);

// Deactive TODO Mục 4.3
router.delete("/:id", auth_role([2]), async function (req, res) {
  const id = req.params.id;
  // const authData = req.authData;
  try {
    const tokens = await tokenRepo.getByUserId(id);
    for (const token of tokens) {
      redisClient.del(token.access_token);
    }
    const isDelete = await tokenRepo.removeByUserId(id);
    if (isDelete) {
      const result = await userRepo.remove(id);
      return res.json(response(result, 0, "success"));
    }
    throw "error";
  } catch (e) {
    logger.error(`Delete user error: ${e}`);
    return res.json(response({}, -1, "something wrong"));
  }
});
module.exports = router;
