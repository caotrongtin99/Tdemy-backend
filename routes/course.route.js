const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const chapterRepo = require("../repository/chapter.repo");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const rand = require("rand-token");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Nested chapter
router.use('/:id/chapters', require("./chapter.route"));
// Nested feedback
router.use('/:id/feedback', require("./feedback.route"));
// Enrollment
router.post('/:id/enroll', auth_role([0,1]), async function (req, res) {
    const course_id = req.params.id;
    const authData = req.authData;
    try{

    }catch (e) {
        logger.error("Enroll to course %s error %s", course_id, e);
        res.json(response({},-1,"Enroll error"));
    }
})
// Get All course
router.get("/", async function (req, res) {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const type = req.body.type;
    const type_id = req.body.type_id;
    try {
        let data = [];
        let courses;
        switch (type) {
            case "student":
                courses = await courseRepo.getAll(limit, offset);
                break;
            case "teacher":
                courses = await courseRepo.getAllByOwnerId(type_id, limit, offset);
                break;
            default:
                courses = await courseRepo.getAll(limit, offset);
        }

        for (const course of courses) {
            const chapter_number = await chapterRepo.countByCourseId(course.id);
            const enroll = 0;
            const isEnroll = false;

            let course_data = {...course.dataValues, chapter_number: chapter_number, owner_name: course.User.name, enroll: enroll, isEnroll:isEnroll};
            delete course_data.User;
            data.push(course_data);
        }
        res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get all course error: %s", e);
    }
});

// Create new Course
const register_course_schema = require("../schemas/register_course.json");
router.post("/", auth_role([1]), validation(register_course_schema), async function (req, res) {
    const reqData = req.body;
    const authData = req.authData;
    try {
        const course = {
            code: rand.generate(6),
            owner_id: authData.owner_id,
            name: reqData.name,
            category: reqData.category,
            avatar_url: reqData.avatar_url,
            description: reqData.description,
            fee: reqData.fee
        };
        const result = await courseRepo.create(course);
        res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Create new Course error: ", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Get detail course
router.get("/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const course = await courseRepo.getById(id);
        const chapter_list = await chapterRepo.getAllByCourseId(id);
        const enroll = 0;
        const isEnroll = false;

        let data = {...course.dataValues, owner_name: course.User.name, enroll:enroll, isEnroll:isEnroll, chapter_number: chapter_list.count, chapters: chapter_list.rows};
        delete data.User;
        res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get detail course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update course
const update_course_schema = require("../schemas/update_course.json");
router.put("/:id", auth_role([1]), validation(update_course_schema), async function (req, res) {
    const reqData = req.body;
    const id = req.params.id;
    const authData = req.authData;
    try {
        let course = await courseRepo.getById(id);
        if (course && course.owner_id === authData.owner_id) {
            delete reqData.accessToken;
            delete reqData.refreshToken;
            course = await courseRepo.update(id, reqData);
            res.json(response(course, 0, "success"));
        } else {
            logger.info("Update course not have permission");
            return res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Update course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Delete course
router.delete("/:id", auth_role([1, 2]), async function (req, res) {
    const id = req.params.id;
    const authData = req.authData;
    try {
        let course = await courseRepo.getById(id);
        if (course && course.owner_id === authData.owner_id) {
            const result = await courseRepo.remove(id);
            logger.info("Delete course success");
            return res.json(response(result, 0, "success"));
        } else {
            return res.json(response({}, 400, "You do not have "))
        }
    } catch (e) {
        logger.error("Delete course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;