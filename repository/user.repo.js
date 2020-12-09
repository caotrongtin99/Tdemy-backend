const User = require('../models').User;

async function getAll() {
	const users = await User.findAll();
	return users;
}

async function getById(id) {
	const user = await User.findByPk(id);
	return user;
}

async function create(user) {
	const res = await User.create(user);
	return res;
}

async function update(id, user) {
	const res = await User.update(user, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await User.destroy({
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