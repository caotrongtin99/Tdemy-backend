const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const userRepo = require("../repository/user.repo");
// const sendMail = require("../utils/mailer");
// const mailModel = require("../utils/mail.model");

router.get("/", async function (req, res) {
  const user = await userRepo.getAll();
  res.json(response(user, 0, "success"));
});

// Register route
const register_schema = require("../schemas/register.json");
router.post("/", validation(register_schema), async function (req, res) {
  const user = req.body;
  const userFind = await userRepo.getByEmail(user.email);
  if(userFind.length != 0){
    return res.json("ACCOUNT EXISTS")
  }

  const result = await userRepo.create(user);
  // result.remove('password');
  // sendMail(mailModel);
  res.json(response(result, 0, "success"));
});

router.get("/:id", async function(req, res){
  const id = req.params.id;
  const result = await userRepo.getById(id);
  res.json(response(result, 0, "success"));
})

// Update
const update_schema = require("../schemas/update_user.json");
router.post("/:id", validation(update_schema), async function(req, res){
  const id = req.params.id;
  const user = req.body;
  const result = await userRepo.update(id, user);
  res.json(response(result, 0, "success"));
})

// Deactive
router.delete("/:id", async function(req, res){
  const id = req.params.id;
  const result = await userRepo.remove(id);
  res.json(response(result, 0, "success"));
})
module.exports = router;
