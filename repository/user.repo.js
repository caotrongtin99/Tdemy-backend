const User = require("../models").User;

async function getAll() {
  const users = await User.findAll();
  return users;
}

async function getById(id) {
  const user = await User.findByPk(id);
  return user;
}
async function getByEmail(email) {
  const user = await User.findAll({
    where: {
      email: email,
    },
  });
}
async function create(user) {
  user.password = bcrypt.hashSync(user.password, process.env.SALT || 10);
  const res = await User.create(user);
  return res;
}

async function update(id, user) {
  const res = await User.update(user, {
    where: {
      id: id,
    },
  });
  return res;
}
async function update_ref_token(uid, refreshToken) {
  const res = await User.update(
    { ref_token: refreshToken },
    {
      where: {
        id: uid,
      },
    }
  );
}
async function remove(id) {
  const res = await User.destroy({
    where: {
      id: id,
    },
  });
  return res;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
