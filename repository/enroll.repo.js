const Enroll = require("../models").Enroll;
const User = require("../models").User;
const Course = require("../models").Course;

async function getAll(limit, offset) {
    return  await Enroll.findAll({
        limit: limit,
        offset: offset
    });
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
    console.log("into", user_id);
    let res = await Enroll.findAndCountAll({
        where:{
            user_id: user_id
        },
        limit: limit,
        offset: offset,
        include: Course
            // model: Course,
            // include: [{
            //     model: User,
            //     attributes: ['name']
            // }]
        // }
    });
    console.log(res.rows);
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
    getAllByEnrollId,
    getUserByCourseId,
    getCourseByUserId,
    getAll,
    getById,
    create,
    update,
    remove,
};