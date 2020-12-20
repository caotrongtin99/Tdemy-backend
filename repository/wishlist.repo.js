const WishList = require("../models").WishList;

async function getAll() {
	return await WishList.findAll();
}
async function checkExist(user_id, course_id){
	return await getWishList(user_id, course_id) !== null;
}
async function getWishList(user_id, course_id){
	return await WishList.findOne({
		where:{
			user_id: user_id,
			course_id: course_id
		}
	})
}
async function getAllByOwnerId(user_id) {
	return await WishList.findAndCountAll({
		where:{
			user_id: user_id
		}
	});
}
async function getById(id) {
	return await WishList.findByPk(id);
}

async function create(wishlist) {
	return await WishList.create(wishlist);
}

async function update(id, wishlist) {
  return await WishList.update(wishlist, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
	return await WishList.destroy({
		where: {
			id: id
		}
	});
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