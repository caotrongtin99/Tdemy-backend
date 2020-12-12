const WishList = require("../models").WishList;

async function getAll() {
	const users = await WishList.findAll();
	return users;
}

async function getById(id) {
	const user = await WishList.findByPk(id);
	return user;
}

async function create(user) {
	const res = await WishList.create(user);
	return res;
}

async function update(id, user) {
	const res = await WishList.update(user, {
			where: {
				id: id
			}
		});
	return res;
}

async function remove(id) {
	const res = await WishList.destroy({
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