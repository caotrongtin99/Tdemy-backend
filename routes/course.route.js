const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const chapterRepo = require("../repository/chapter.repo");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;
// Get All course
router.get("/", async function (req, res) {
    try {
        // return student number, chapter
        // id, name, owner_id, owner_name, fee, rate, discount, code
        let data = [];
        const courses = await courseRepo.getAll();
        for (const course of courses) {
            const chapter_number = await chapterRepo.countByCourseId(course.id);
            const owner_name = await userRepo.getNameById(course.owner_id);
            data.push({...course.dataValues, chapter_number: chapter_number, owner_name: owner_name});
        };
        res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get all course error: %s", e);
    }
});

// Get detail course
router.get("/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const course = await courseRepo.getById(id);
        const chapter_list = await chapterRepo.getAllByCourseId(id);
        let data = {...course.dataValues, chapters:chapter_list};
        res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get detail course error: %s", e);
        res.json(response({},-1,"something wrong"));
    }
})

// Create new Course
const register_course_schema = require("../schemas/register_course.json");
router.post("/", auth_role([1]), validation(register_course_schema), async function (req, res) {
    const reqData = req.body;
    try {
        const course = await courseRepo.create(reqData);
        res.json(response(course, 0, "success"));
    } catch (e) {
        logger.error("Create new Course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update course
const update_course_schema = require("../schemas/update_course.json");
router.put("/:id", validation(update_course_schema), async function (req, res) {
    const reqData = req.body;
    const id = req.params.id;
    try {
        // update field fe lo
        const course = await courseRepo.update(id, reqData);
        res.json(response(course, 0, "success"));
    } catch (e) {
        logger.error("Update course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Delete course
router.delete("/:id", auth_role([1, 2]), async function (req, res) {
    const id = req.params.id;
    try {
        //check owner
        const result = await courseRepo.remove(id);
        res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Delete course error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;