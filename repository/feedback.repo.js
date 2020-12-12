const FeedBack = require("../models").FeedBack;

async function getAll() {
	const users = await FeedBack.findAll();
	return users;
}

async function getById(id) {
	const user = await FeedBack.findByPk(id);
	return user;
}

async function create(user) {
	const res = await FeedBack.create(user);
	return res;
}

async function update(id, user) {
	const res = await FeedBack.update(user, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await FeedBack.destroy({
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