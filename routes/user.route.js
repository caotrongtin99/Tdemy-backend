const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");

const userModel = require("../models/user.model");

const router = express.Router();

router.post("/", async function (req, res) {
  const user = req.body;
  if ((await userModel.singleByUserName(user.username)) === null) {
    res.status(409);
  }
  user.password = bcrypt.hashSync(user.password, 10);
  const rfToken = randToken.generate(80);
  user.name = user.name || '';
  user.rfToken = rfToken;
  user.id = await userModel.add(user);
  delete user.password;
  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    "SECRET_KEY",
    {
      expiresIn: 10 * 60,
    }
  );
  user.accessToken = accessToken;
  res.cookie("accessToken", accessToken, {expires: false});
  res.cookie("refreshToken",rfToken, {expires: false});
  res.redirect("/");
  // res.status(201).json(user);
});

module.exports = router;
