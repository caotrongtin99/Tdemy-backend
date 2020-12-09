const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll() {
	const users = await models.user.findAll();
	return users;
}

async function getById(id) {
	const user = await models.user.findByPk(id);
	return user;
}

async function create(user) {
	const res = await models.user.create(user);
	return res;
}

async function update(id, user) {
	const res = await models.user.update(user, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await models.user.destroy({
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