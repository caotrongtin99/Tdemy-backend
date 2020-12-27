const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const randToken = require("rand-token");
const userRepo = require("../repository/user.repo");
const tokenRepo = require("../repository/token.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;
const redisClient = require("../utils/redis");
const sendMail = require("../utils/mailer");

// Get list user
router.get("/", auth_role([2]), async function (req, res) {
  try {
    const users = await userRepo.getAll();
    let list_user = [];
    for(const user of users.rows){
      let data = {
        ...user.dataValues
      };
      delete data.password;
      list_user.push(data);
    }
    res.json(response({count: users.count, rows: list_user}, 0, "success"));
  } catch (e) {
    logger.error("Get Users error: %s", e);
    res.json(response({}, -1, "something wrong"));
  }
});

// Register route
const register_schema = require("../schemas/register.json");
const register_mail = require("../utils/mail.model").register_message;
router.post("/", validation(register_schema), async function (req, res) {
  const user = req.body;
  try {
    const userFind = await userRepo.getByEmail(user.email);
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

// Get detail
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

// Update
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

// Deactive
router.delete("/:id", auth_role([0, 1, 2]), async function (req, res) {
  const id = req.params.id;
  const authData = req.authData;
  try {
    const tokens = await tokenRepo.getByEmail(authData.email);
    for (const token of tokens) {
      redisClient.del(token.access_token);
    }
    const isDelete = await tokenRepo.removeByEmail(authData.email);
    if (isDelete) {
      const result = await userRepo.remove(id);
      return res.json(response(result, 0, "success"));
    }
    throw "error";
  } catch (e) {
    logger.error(`Delete user error: ${e}`);
    res.json(response({}, -1, "something wrong"));
  }
});
module.exports = router;
