const Chapter = require("../models").Chapter;

async function getAll() {
	const users = await Chapter.findAll();
	return users;
}

async function getById(id) {
	const user = await Chapter.findByPk(id);
	return user;
}

async function create(user) {
	const res = await Chapter.create(user);
	return res;
}

async function update(id, user) {
	const res = await Chapter.update(user, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await Chapter.destroy({
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