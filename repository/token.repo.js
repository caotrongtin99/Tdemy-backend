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

async function removeByUserId(id){
  return await Token.destroy({
    where:{
      user_id: id
    }
  })
}
async function removeByEmail(email) {
  return await Token.destroy({
    where: {
      email: email,
    },
  });
}
async function removeByAccessToken(accessToken) {
    return await Token.destroy({
      where: {
        accessToken: accessToken,
      },
    });
  }

module.exports = {
  getAll,
  getByEmail,
  getByUserId,
  getByAccessToken,
  removeByEmail,
  removeByUserId,
  create,
  removeByAccessToken
};
