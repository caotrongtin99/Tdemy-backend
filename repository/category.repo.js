const Category = require("../models").Category;

async function getAll() {
  return await Category.findAndCountAll();
}
async function getAllRoot() {
  return await Category.findAndCountAll({
    where: {
      path: null,
    },
  });
}
async function getAllLeaf(name) {
  return await Category.findAndCountAll({
    where: {
      path: name,
    },
  });
}
async function getByName(name) {
  return await Category.findByPk(name);
}

async function isExist(name) {
  const count = await Category.count({
    where: {
      name: name,
    },
  });
  return count || 0;
}

async function create(category) {
  return await Category.create(category);
}

async function update(name, category) {
  return await Category.update(category, {
    where: {
      name: name,
    },
  });
}

async function remove(name) {
  return await Category.destroy({
    where: {
      name: name,
    },
  });
}

module.exports = {
  getAllRoot,
  getAllLeaf,
  getAll,
  getByName,
  isExist,
  create,
  update,
  remove,
};
