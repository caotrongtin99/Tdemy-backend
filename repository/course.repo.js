const Course = require("../models").Course;
const User = require("../models").User;
const Chapter = require("../models").Chapter;

async function getAll(limit, offset) {
    return await Course.findAll({
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: ['name']
        }
    });
}

async function getAllByOwnerId(user_id, limit, offset) {
    return await Course.findAll({
        where: {
            owner_id: user_id
        },
        limit: limit,
        offset: offset
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
    getAllByOwnerId,
    getAll,
    getById,
    create,
    update,
    remove,
};