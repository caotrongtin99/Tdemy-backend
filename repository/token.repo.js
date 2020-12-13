const Token = require("../models").Token;

async function getAll() {
  const token = await Token.findAll();
  return token;
}

async function getByUserId(user_id){
  const token = await Token.findAll({
    where: {
      user_id: user_id,
    },
  });
  return token;
}
async function getByEmail(email) {
  const token = await Token.findAll({
    where: {
      email: email,
    },
  });
  return token;
}

async function getByAccessToken(accessToken) {
    const token = await Token.findAll({
      where: {
        accessToken: accessToken,
      },
    });
    return token;
}

async function create(token) {
  const res = await Token.create(token);
  return res;
}

async function removeByEmail(email) {
  const res = await Token.destroy({
    where: {
      email: email,
    },
  });
  return res;
}
async function removeByAccessToken(accessToken) {
    const res = await Token.destroy({
      where: {
        accessToken: accessToken,
      },
    });
    return res;
  }

module.exports = {
  getAll,
  getByEmail,
  getByUserId,
  getByAccessToken,
  removeByEmail,
  create,
  removeByAccessToken
};
