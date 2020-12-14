const Tracking = require("../models").Tracking;

async function getAll() {
    const trackings = await Tracking.findAll();
    return trackings;
}

async function getAllByCourseId(course_id, limit, offset){
    return await Tracking.findAll({
        where:{
            course_id: course_id
        },
        limit: limit,
        offset: offset
    })
}

async function getAllByUserId(tracking_id){
    return await Tracking.findAll({
        where:{
            owner_id:tracking_id
        }
    })
}
async function getById(id) {
    const tracking = await Tracking.findByPk(id);
    return tracking;
}

async function create(tracking) {
    const res = await Tracking.create(tracking);
    return res;
}

async function update(id, tracking) {
    const res = await Tracking.update(tracking, {
        where: {
            id: id
        }
    });
    return res;
}

async function remove(id) {
    const res = await Tracking.destroy({
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