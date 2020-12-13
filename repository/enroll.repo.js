const Enroll = require("../models").Enroll;

async function getAll(limit, offset) {
    return  await Enroll.findAll({
        limit: limit,
        offset: offset
    });
}

async function getUserByCourseId(course_id, limit, offset){
    return await Enroll.findAll({
        where:{
            course_id: course_id
        },
        limit: limit,
        offset: offset,
        include: ['User']
    })
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
    getAllByCourseId,
    getAllByEnrollId,
    getAll,
    getById,
    create,
    update,
    remove,
};