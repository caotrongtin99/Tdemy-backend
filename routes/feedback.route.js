const router = require("express").Router({ mergeParams: true });
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const feedbackRepo = require("../repository/feedback.repo");
const enrollRepo = require("../repository/enroll.repo");
const courseRepo = require("../repository/course.repo");
const auth_role = require("../middleware/auth.mdw").auth_role;
const logger = require("../utils/log");

// Get All feedback
router.get("/", auth_role([]), async function (req, res) {
    const course_id = req.params.id;
    const limit = req.query.limit || Number.parseInt(process.env.DEFAULT_LIMIT) || 10;
    const offset = req.query.offset || Number.parseInt(process.env.DEFAULT_OFFSET) || 0;
    const authData = req.authData;
    try {
        let feedback = await feedbackRepo.getAllByCourseId(course_id, limit, offset);
        feedback = {
            array: feedback.rows,
            count: feedback.count,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        }
        res.json(response(feedback, 0, "success"));
    } catch (e) {
        logger.error("Get all feedback error: %s", e);
    }
});

// Create new feedback TODO Mục 2.4
const register_feedback_schema = require("../schemas/register_feedback.json");
router.post("/", auth_role([0, 1, 2]),validation(register_feedback_schema), async function (req, res) {
    const reqData = req.body;
    const course_id = req.params.id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(course_id);
        if (course) {
            const isEnroll = await enrollRepo.checkEnroll(authData.owner_id, course_id);
            if(!isEnroll){
                return res.json(response({}, 400, "You need to enroll this course to feedback"));
            }
            let feedback = {...reqData, owner_id: authData.owner_id, course_id: course_id};
            feedback = await feedbackRepo.create(feedback);
            recall_rating(course_id);
            feedback = {
                ...feedback.dataValues,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
            res.json(response(feedback, 0, "success"));
        } else {
            logger.info("Create feedback not permission");
            res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Create new feedback error: ", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update feedback
const update_feedback_schema = require("../schemas/update_feedback.json");
router.put("/:feedback_id", auth_role([0, 1, 2]), validation(update_feedback_schema), async function(req, res){
    const course_id = req.params.id;
    const feedback_id = req.params.feedback_id;
    const reqData = req.body;
    const authData = req.authData;
    try{
        const course = await courseRepo.getById(course_id);
        let feedback = await feedbackRepo.getById(feedback_id);
        if (course && feedback && feedback.owner_id === authData.owner_id) {
            feedback = await feedbackRepo.update(feedback_id, reqData);
            feedback = {
                ...feedback,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
            recall_rating(course_id);
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
router.delete("/:feedback_id", auth_role([0, 1, 2]), async function(req, res){
    const course_id = req.params.id;
    const feedback_id = req.params.feedback_id;
    const authData = req.authData;
    try{
        const course = await courseRepo.getById(course_id);
        let feedback = await feedbackRepo.getById(feedback_id);
        if(course && feedback && feedback.owner_id === authData.owner_id) {
            let result = await feedbackRepo.remove(feedback_id);
            result = {
                ...result,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
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

async function recall_rating(course_id){
    const sum = (await feedbackRepo.sumByCourseId(course_id))[0].dataValues.rating;
    const count = await feedbackRepo.countByCourseId(course_id);
    const rating = sum / count;
    logger.info(`Sum: ${sum}: Count: ${count}: Rating: ${rating}`);
    await courseRepo.update(course_id,{
        rate: rating
    });
}
module.exports = router;