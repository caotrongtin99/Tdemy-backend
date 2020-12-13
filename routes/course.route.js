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
// Get All course
router.get("/", async function (req, res) {
    try {
        // return student number, chapter
        let data = [];
        const courses = await courseRepo.getAll();
        for (const course of courses) {
            const chapter_number = await chapterRepo.countByCourseId(course.id);
            const enroll = 0;
            const owner_name = await userRepo.getNameById(course.owner_id);
            const isEnroll = false;
            data.push({...course.dataValues, chapter_number: chapter_number, owner_name: owner_name.name, enroll: enroll, isEnroll:isEnroll});
        }
        ;
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
        // get number student
        const course = await courseRepo.getById(id);
        const chapter_list = await chapterRepo.getAllByCourseId(id);
        const enroll = 0;
        const owner_name = await userRepo.getNameById(course.owner_id);
        const isEnroll = false;
        let data = {...course.dataValues, owner_name: owner_name.name, enroll:enroll, isEnroll:isEnroll, chapters: chapter_list};
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