const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;
// const sendMail = require("../utils/mailer");
// const mailModel = require("../utils/mail.model");

// Get list user
router.get("/", auth_role([2]), async function (req, res) {
  try {
    const user = await userRepo.getAll();
    res.json(response(user, 0, "success"));
  }catch (e){
    logger.error("Get Users error: %s", e);
    res.json(response({},-1, "something wrong"));
  }
});

// Register route
const register_schema = require("../schemas/register.json");
router.post("/", validation(register_schema), async function (req, res) {
  const user = req.body;
  try {
    const userFind = await userRepo.getByEmail(user.email);
    if (userFind.length !== 0) {
      return res.json(response({},409,"email exist"));
    }
    let result = await userRepo.create(user);
    // sendMail(mailModel);
    result = {...result.dataValues};
    delete result.password;
    res.json(response(result, 0, "success"));
  }catch (e){
    logger.error("Register error: %s",e);
    res.json(response({},-1,"something wrong"));
  }
});

// Get detail
router.get("/:id", async function(req, res){
  const id = req.params.id;
  try {
    const result = await userRepo.getById(id);
    res.json(response(result, 0, "success"));
  }catch (e){
    logger.error("Get user detail error", e);
    res.json(response({},-1,"something wrong"));
  }
})

// Update
const update_schema = require("../schemas/update_user.json");
router.put("/:id", validation(update_schema), async function(req, res){
  const id = req.params.id;
  const user = req.body;
  try {
    const result = await userRepo.update(id, user);
    res.json(response(result, 0, "success"));
  }catch (e){
    logger.error("Update user error: %s", e);
    res.json(response({},-1,"something wrong"));
  }
})

// Deactive
router.delete("/:id", async function(req, res){
  const id = req.params.id;
  try {
    const result = await userRepo.remove(id);
    res.json(response(result, 0, "success"));
  }catch (e){
    logger.error("Delete user error: %s", e);
    res.json(response({},-1,"something wrong"));
  }
})
module.exports = router;
