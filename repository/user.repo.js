const User = require("../models").User;
const bcrypt = require("bcryptjs");

async function getAll() {
  return await User.findAll();
}

async function getNameById(id){
  return await User.findOne({
    where:{
      id: id,
    },
    attributes: ["name"]
  });
}

async function getById(id) {
  return await User.findByPk(id);
}
async function getByEmail(email) {
  return await User.findAll({
    where: {
      email: email,
    },
  });
}
async function create(user) {
  user.password = bcrypt.hashSync(user.password, process.env.SALT || 10);
  return User.create(user);
}

async function update(id, user) {
  return  await User.update(user, {
    where: {
      id: id,
    },
  });
}
async function update_ref_token(uid, refreshToken) {
  return await User.update(
    { ref_token: refreshToken },
    {
      where: {
        id: uid,
      },
    }
  );
}
async function remove(id) {
  return await User.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  getNameById,
  getAll,
  getById,
  create,
  update,
  remove,
  update_ref_token,
  getByEmail
};
