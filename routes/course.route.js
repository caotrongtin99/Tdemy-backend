const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const logger = require("../utils/log");

// Get All course
router.get("/", async function (req, res) {
    try {
        const course = await courseRepo.getAll();
        res.json(response(course, 0, "success"));
    } catch (e) {
        logger.error("Get all course error: %s", e);
    }
});

// Create new Course
const register_course_schema = require("../schemas/register_course.json");
router.post("/", validation(register_course_schema), async function (req, res) {
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
router.put("/:id", validation(update_course_schema), async function(req, res){
    const reqData = req.body;
    const id = req.params.id;
    try{
        const course = await courseRepo.update(id, reqData);
        res.json(response(course, 0, "success"));
    }catch (e) {
        logger.error("Update course error: %s", e);
        res.json(response({},-1,"something wrong"));
    }
})

// Delete course
router.delete("/:id", async function(req, res){
    const id = req.params.id;
    try{
        const result = await courseRepo.remove(id);
        res.json(response(result,0,"success"));
    }catch (e) {
        logger.error("Delete course error: %s",e);
        res.json(response({}, -1,"something wrong"));
    }
})
module.exports = router;