const router = require("express").Router();

const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const validation = require("../middleware/validation.mdw");

const userModel = require("../models/user.model");
const userRepo = require("../repository/user.repo");
const sendMail = require("../utils/mailer");
const mailModel = require("../utils/mail.model");

router.get("/", async function (req, res) {
  const user = await userRepo.getAll();
  res.json(user);
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
  // sendMail(mailModel);
  res.json(result);
});

router.get("/:id", async function(req, res){
  const id = req.params.id;
  const result = await userRepo.getById(id);
  res.json(result);
})
// Update
const update_schema = require("../schemas/update_user.json");
router.post("/:id", validation(update_schema), async function(req, res){
  const id = req.params.id;
  const user = req.body;
  const result = await userRepo.update(id, user);
  res.json(result);
})
// Deactive
router.delete("/:id", async function(req, res){
  const id = req.params.id;
  const result = await userRepo.remove(id);
  res.json(result);
})
module.exports = router;
