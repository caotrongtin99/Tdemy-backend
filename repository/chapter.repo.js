const Chapter = require("../models").Chapter;

async function getAll() {
	const chapters = await Chapter.findAll();
	return chapters;
}

async function getById(id) {
	const chapter = await Chapter.findByPk(id);
	return chapter;
}

async function countByCourseId(course_id){
	const count = await Chapter.count({
		where:{
			course_id: course_id
		},
	})
	return count || 0;
}

async function getAllByCourseId(course_id){
	const chapters = await Chapter.findAndCountAll({
		where:{
			course_id: course_id
		},
		order: [["code", "ASC"]]
	})
	console.log(chapters.dataValues);
	return chapters;
}
async function getPreviewChapter(course_id){
	const chapters = await Chapter.findAll({
		where:{
			course_id: course_id
		},
		order: [["code", "ASC"]],
		limit: process.env.NUMBER_CHAPTER_PREVIEW || 1
	});
	return chapters;
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
	getPreviewChapter,
	getAllByCourseId,
	countByCourseId,
	getAll,
	getById,
	create,
	update,
	remove,
};