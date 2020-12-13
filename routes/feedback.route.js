const router = require("express").Router({mergeParams: true});
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const feedbackRepo = require("../repository/feedback.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Get All feedback
router.get("/", async function (req, res) {
    const course_id = req.params.id;
    const limit = req.query.limit;
    const offset = req.query.offset;
    try {
        const feedback = await feedbackRepo.getAllByCourseId(course_id, limit, offset);
        res.json(response(feedback, 0, "success"));
    } catch (e) {
        logger.error("Get all feedback error: %s", e);
    }
});

// Create new feedback
const register_feedback_schema = require("../schemas/register_feedback.json");
router.post("/", auth_role([0,1]),validation(register_feedback_schema), async function (req, res) {
    const reqData = req.body;
    const course_id = req.params.id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(course_id);
        if (course) {
            delete reqData.accessToken;
            delete reqData.refreshToken;
            let feedback = {...reqData, owner_id: authData.owner_id, course_id: course_id};
            feedback = await feedbackRepo.create(feedback);
            res.json(response(feedback, 0, "success"));
        } else {
            logger.info("Create feedback not permission");
            res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Create new feedback error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update feedback
const update_feedback_schema = require("../schemas/update_feedback.json");
router.put("/:feedback_id", auth_role([0,1]), validation(update_feedback_schema), async function(req, res){
    const course_id = req.params.id;
    const feedback_id = req.params.feedback_id;
    const authData = req.authData;
    try{
        const course = await courseRepo.getById(course_id);
        let feedback = await feedbackRepo.getById(feedback_id);
        if (course && feedback && feedback.owner_id === authData.owner_id) {
            let update = {...reqData};
            delete update.accessToken;
            delete update.refreshToken;
            feedback = await feedbackRepo.update(feedback_id, update);
            res.json(response(feedback, 0, "success"));
        } else {
            logger.info("Update feedback not permission or not exist");
            return res.json(response({}, 400, "You not have permission"));
        }
    }catch (e) {
        logger.error("Update feedback error: %s", e);
        res.json(response({},-1,"something wrong"));
    }
})

// Delete feedback
router.delete("/:feedback_id", auth_role([0,1,2]), async function(req, res){
    const course_id = req.params.id;
    const feedback_id = req.params.feedback_id;
    const authData = req.authData;
    try{
        const course = await courseRepo.getById(course_id);
        let feedback = await feedbackRepo.getById(feedback_id);
        if(course && feedback && feedback.owner_id === authData.owner_id) {
            const result = await feedbackRepo.remove(feedback_id);
            res.json(response(result, 0, "success"));
        }else{
            logger.info("Delete feedback not permission or not exist");
            return res.json(response({}, 400, "You not have permission"));
        }
    }catch (e) {
        logger.error("Delete feedback error: %s",e);
        res.json(response({}, -1,"something wrong"));
    }
})
module.exports = router;