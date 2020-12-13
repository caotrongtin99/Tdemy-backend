const router = require("express").Router({mergeParams: true});
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const chapterRepo = require("../repository/chapter.repo");
const courseRepo = require("../repository/course.repo");
const rand = require("rand-token");
const auth_role = require("../middleware/auth.mdw").auth_role;
const logger = require("../utils/log");

// Get All chapter
router.get("/", async function (req, res) {
    const course_id = req.params.id;
    try {
        // id, name, duration, status
        const chapter = await chapterRepo.getAllByCourseId(course_id);
        res.json(response(chapter, 0, "success"));
    } catch (e) {
        logger.error("Get all chapter error: %s", e);
    }
});
// get preview

// Get detail
router.get("/:chapter_id", async function(req, res){
    const course_id = req.params.id;
    const chapter_id = req.params.chapter_id;
    try {
        // id, name, duration, status
        const chapter = await chapterRepo.getById(chapter_id);
        res.json(response(chapter, 0, "success"));
    } catch (e) {
        logger.error("Get all chapter error: %s", e);
    }
})
// Create new chapter
const register_chapter_schema = require("../schemas/register_chapter.json");
router.post("/", auth_role([1]), validation(register_chapter_schema), async function (req, res) {
    const reqData = req.body;
    const course_id = req.params.id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(course_id);
        if (course && course.owner_id === authData.owner_id) {
            delete reqData.accessToken;
            delete reqData.refreshToken;
            let chapter = {...reqData, code: rand.generate(6), course_id: course_id};
            chapter = await chapterRepo.create(chapter);
            res.json(response(chapter, 0, "success"));
        } else {
            logger.info("Create chapter not permission");
            res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Create new chapter error: ", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update chapter
const update_chapter_schema = require("../schemas/update_chapter.json");
router.put("/:chapter_id", auth_role([1]), validation(update_chapter_schema), async function (req, res) {
    const reqData = req.body;
    const course_id = req.params.id;
    const chapter_id = req.params.chapter_id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(course_id);
        let chapter = await chapterRepo.getById(chapter_id);
        if (course && chapter && course.owner_id === authData.owner_id) {
            delete reqData.accessToken;
            delete reqData.refreshToken;
            chapter = await chapterRepo.update(chapter_id, reqData);
            res.json(response(chapter, 0, "success"));
        } else {
            logger.info("Update chapter not permission or not exist");
            return res.json(response({}, 400, "You not have permission"));
        }
    } catch (e) {
        logger.error("Update chapter error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Delete chapter
router.delete("/:chapter_id", auth_role([1]), async function (req, res) {
    const course_id = req.params.id;
    const chapter_id = req.params.chapter_id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(course_id);
        if (course && course.owner_id === authData.owner_id) {
            const result = await chapterRepo.remove(chapter_id);
            res.json(response(result, 0, "success"));
        } else {
            logger.info("Delete chapter not permission");
            res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Delete chapter error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;