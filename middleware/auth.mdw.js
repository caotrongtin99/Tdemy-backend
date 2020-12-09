const jwt = require("jsonwebtoken");
const session = require("express-session");
const userModel = require("../models/user.model");

let auth = function (req, res, next) {
  const accessToken = req.headers["x-access-token"];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, "SECRET_KEY");
      req.accessTokenPayload = decoded;
    } catch (err) {
      return res.status(401).json({
        message: "Invalid access token.",
      });
    }
    next();
  } else {
    return res.status(400).json({
      message: "Access token not found.",
    });
  }
};

let auth_redirect = async function (req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, "SECRET_KEY");
      req.accessTokenPayload = decoded;
      next();
    } else {
      throw "Access Token null";
    }
  } catch (err) {
    if (refreshToken) {
      var token = await generateFromRefreshToken(refreshToken);
      if (token !== null) {
        res.cookie("accessToken", token, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        next();
      } else {
        res.cookie("redirectTo", req.path, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        res.redirect("/login");
      }
    } else {
      res.cookie("redirectTo", req.path, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });
      res.redirect("/login");
    }
  }
};

let generateFromRefreshToken = async function (refreshToken) {
  const ret = await userModel.isRefreshTokenExisted(refreshToken);
  if (ret !== -1) {
    const accessToken = jwt.sign({
        userId: ret,
      },
      "SECRET_KEY", {
        expiresIn: "1m",
      }
    );
    return accessToken;
  }
  return null;
};
let auth_login = async function (req, res, next) {
  const accessToken = req.cookies.accessToken;
  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, "SECRET_KEY");
      res.redirect("/");
    } else {
      throw "Access Token null";
    }
  } catch (err) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      var token = await generateFromRefreshToken(refreshToken);
      if (token !== null) {
        res.cookie("accessToken", token, {
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        res.redirect("/");
      } else {
        next();
      }
    } else {
      next();
    }
  }
};
module.exports = {
  auth_redirect,
  auth_login,
  auth,
  generateFromRefreshToken,
};