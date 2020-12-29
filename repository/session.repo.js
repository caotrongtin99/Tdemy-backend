const Session = require("../models").Session;
const Chapter = require("../models").Chapter;
const sequelize = require("sequelize");
async function getAll() {
  const sessions = await Session.findAll();
  return sessions;
}
async function getByUserIdAndChapterId(user_id, chapter_id){
    return await Session.findOne({
        where:{
            user_id: user_id,
            chapter_id: chapter_id
        },
        include:{
            model: Chapter
        }
    })
}
async function getLatestByUserId(user_id) {
  return await Session.findAndCountAll({
    where: {
      user_id: user_id,
    },
    include: {
      model: Chapter,
    },
  });
}
async function getAllByUserId(user_id) {
  return await Session.findAndCountAll({
    where: {
      user_id: user_id,
    },
    include: {
      model: Chapter,
    },
  });
}
async function getById(id) {
  return await Session.findByPk(id);
}

async function create(session) {
  return await Session.create(session);
}

async function update(user_id, chapter_id, session) {
  return await Session.update(session, {
    where: {
      user_id: user_id,
      chapter_id: chapter_id
    },
  });
}

async function remove(id) {
  return await Session.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
    getByUserIdAndChapterId,
  getLatestByUserId,
  getAllByUserId,
  getAll,
  getById,
  create,
  update,
  remove,
};
