const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");

const userModel = require("../models/user.model");
const userRepo = require("../repository/user.repo");
const router = express.Router();

router.post("/", async function (req, res) {
  const user = await userRepo.getAll();
  console.log(user);
  res.json(user);
});

module.exports = router;
