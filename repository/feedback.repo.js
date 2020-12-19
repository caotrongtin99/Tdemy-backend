const FeedBack = require("../models").Feedback;

async function getAll() {
	const users = await FeedBack.findAll();
	return users;
}

async function getAllByCourseId(course_id, limit, offset){
	return await FeedBack.findAndCountAll({
		where:{
			course_id: course_id
		},
		limit: limit,
		offset: offset
	})
}

async function getAllByUserId(user_id){
	return await FeedBack.findAll({
		where:{
			owner_id:user_id
		}
	})
}
async function getById(id) {
	const user = await FeedBack.findByPk(id);
	return user;
}

async function create(user) {
	console.log("into");
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
	getAllByCourseId,
	getAllByUserId,
	getAll,
	getById,
	create,
	update,
	remove,
};