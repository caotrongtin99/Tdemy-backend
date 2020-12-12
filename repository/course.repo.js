const Course = require("../models").Course;

async function getAll() {
	const users = await Course.findAll();
	return users;
}

async function getById(id) {
	const user = await Course.findByPk(id);
	return user;
}

async function create(user) {
	const res = await Course.create(user);
	return res;
}

async function update(id, user) {
	const res = await Course.update(user, {
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