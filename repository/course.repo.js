const Course = require("../models").Course;
const User = require("../models").User;
const Chapter = require("../models").Chapter;

async function getAll(limit, offset) {
    return await Course.findAndCountAll({
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: ['name']
        }
    });
}
async function getCourseByStudentId(student_id, limit, offset) {
    return await Course.findAndCountAll({
        where: {
            owner_id: student_id
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: ['name']
        }
    })
}

async function getAllByOwnerId(teacher_id, limit, offset) {
    return await Course.findAndCountAll({
        where: {
            owner_id: teacher_id
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: ['name']
        }
    })
}

async function getById(id) {
    return await Course.findOne({
        where: {
            id: id
        },
        include: [{
            model: User,
            attributes: ['name']
        }]
    });
}

async function create(course) {
    return Course.create(course);
}

async function update(id, course) {
    return await Course.update(course, {
        where: {
            id: id
        }
    });
}

async function remove(id) {
    return await Course.destroy({
        where: {
            id: id
        }
    });
}

module.exports = {
    getCourseByStudentId,
    getAllByOwnerId,
    getAll,
    getById,
    create,
    update,
    remove,
};