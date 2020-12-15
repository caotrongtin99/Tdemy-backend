const WishList = require("../models").WishList;

async function getAll() {
	const wishLish = await WishList.findAll();
	return wishLish;
}
async function checkExist(user_id, course_id){
	return await getWishList(user_id, course_id) !== null;
}
async function getWishList(user_id, course_id){
	const wishlist = await WishList.findOne({
		where:{
			user_id: user_id,
			course_id: course_id
		}
	})
	return wishlist;
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
	getWishList,
	checkExist,
	getAllByOwnerId,
	getAll,
	getById,
	create,
	update,
	remove,
};