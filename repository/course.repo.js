const Course = require("../models").Course;

async function getAll(limit, offset) {
	return await Course.findAll({
		limit: limit,
		offset: offset
	});
}
async function getAllByOwnerId(owner_id, limit, offset){
	return await Course.findAll({
		where:{
			owner_id: owner_id
		},
		limit: limit,
		offset: offset
	})
}
async function getById(id) {
	return await Course.findByPk(id);
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