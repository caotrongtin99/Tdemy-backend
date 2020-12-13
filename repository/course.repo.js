const Course = require("../models").Course;

async function getAll(limit, offset) {
	const courses = await Course.findAll({
		limit: limit,
		offset: offset
	});
	return courses;
}

async function getById(id) {
	const course = await Course.findByPk(id);
	return course;
}

async function create(course) {
	const res = await Course.create(course);
	return res;
}

async function update(id, course) {
	const res = await Course.update(course, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await Course.destroy({
		where: {
			id: id
		}
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