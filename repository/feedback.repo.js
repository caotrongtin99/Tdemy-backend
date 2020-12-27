const FeedBack = require("../models").Feedback;
const User = require("../models").User;

async function getAll() {
  const users = await FeedBack.findAll();
  return users;
}

async function getAllByCourseId(course_id, limit, offset) {
  return await FeedBack.findAndCountAll({
    where: {
      course_id: course_id,
    },
    limit: limit,
    offset: offset,
    include: {
      model: User,
      attributes: ["id","name","email","role","avatar_url","status"],
    },
  });
}

async function getAllByUserId(user_id) {
  return await FeedBack.findAll({
    where: {
      owner_id: user_id,
    },
  });
}
async function getById(id) {
  const user = await FeedBack.findByPk(id);
  return user;
}

async function create(feedback) {
  return await FeedBack.create(feedback);
}

async function update(id, feedback) {
  return await FeedBack.update(feedback, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await FeedBack.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  getAllByCourseId,
  getAllByUserId,
  getAll,
  getById,
  create,
  update,
  remove,
};
