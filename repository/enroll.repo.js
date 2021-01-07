const Enroll = require("../models").Enroll;
const User = require("../models").User;
const Course = require("../models").Course;
const sequelize = require("sequelize");
const { Op } = require("sequelize");
async function getAll(limit, offset) {
    return  await Enroll.findAndCountAll({
        limit: limit,
        offset: offset
    });
}

async function getMostEnroll(limit, offset){
    return await Enroll.findAll({
        attributes: ['course_id', [sequelize.fn('count', sequelize.col('user_id')), 'count']],
        group: ['course_id'],
        order: [['count','DESC']],
        limit: limit,
        offset: offset
    })
}
async function getMostEnrollWeek(limit, offset, from, to){
        return await Enroll.findAll({
          attributes: [
            "course_id",
            [sequelize.fn("count", sequelize.col("user_id")), "count"],
          ],
          where:{
              created_at: {
                  [Op.between]: [from, to]
              }
          },
          group: ["course_id"],
          order: [["count", "DESC"]],
          limit: limit,
          offset: offset,
        });
}
async function getEnroll(user_id, course_id) {
  return await Enroll.findOne({
    where: {
      course_id: course_id,
      user_id: user_id,
    },
  });
}
async function checkEnroll(user_id, course_id){
    const res = await Enroll.findOne({
        where:{
            course_id: course_id,
            user_id: user_id
        }
    })
    return res !== null;
}
async function countByCourseId(course_id){
    const count = await Enroll.count({
		where:{
			course_id: course_id
		},
	})
	return count || 0;
}
async function getUserByCourseId(course_id, limit, offset){
    return await Enroll.findAndCountAll({
        where:{
            course_id: course_id
        },
        limit: limit,
        offset: offset,
        include: User
    })
}
async function getCourseByUserId(user_id, limit, offset){
    let res = await Enroll.findAndCountAll({
        where:{
            user_id: user_id
        },
        limit: limit,
        offset: offset,
        include: {
            model: Course
        }
    });
    return res;
}

async function getAllByEnrollId(enroll_id){
    return await Enroll.findAll({
        where:{
            owner_id:enroll_id
        }
    })
}
async function getById(id) {
    return  await Enroll.findByPk(id);
}

async function create(enroll) {
    return Enroll.create(enroll);
}

async function update(id, enroll) {
    return  await Enroll.update(enroll, {
        where: {
            id: id
        }
    });
}

async function remove(id) {
    return await Enroll.destroy({
        where: {
            id: id
        }
    });
}

module.exports = {
    getMostEnrollWeek,
    getAllByEnrollId,
    getMostEnroll,
    checkEnroll,
    getEnroll,
    getUserByCourseId,
    countByCourseId,
    getCourseByUserId,
    getAll,
    getById,
    create,
    update,
    remove,
};