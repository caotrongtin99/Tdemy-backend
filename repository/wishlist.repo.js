const WishList = require("../models").WishList;

async function getAll() {
	const wishLish = await WishList.findAll();
	return wishLish;
}

async function getAllByOwnerId(user_id) {
	const wishLish = await WishList.findAndCountAll({
		where:{
			user_id: user_id
		}
	});
	return wishLish;
}
async function getById(id) {
	const wishLish = await WishList.findByPk(id);
	return wishLish;
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
	getAllByOwnerId,
	getAll,
	getById,
	create,
	update,
	remove,
};