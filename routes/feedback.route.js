const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const feedbackRepo = require("../repository/feedback.repo");
const logger = require("../utils/log");

// Get All feedback
router.get("/", async function (req, res) {
    try {
        //LIMIT OFFSET
        const feedback = await feedbackRepo.getAll();
        res.json(response(feedback, 0, "success"));
    } catch (e) {
        logger.error("Get all feedback error: %s", e);
    }
});

// Create new feedback
const register_feedback_schema = require("../schemas/register_feedback.json");
router.post("/", auth_role([0,1]),validation(register_feedback_schema), async function (req, res) {
    const reqData = req.body;
    try {
        const feedback = await feedbackRepo.create(reqData);
        res.json(response(feedback, 0, "success"));
    } catch (e) {
        logger.error("Create new feedback error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update feedback
const update_feedback_schema = require("../schemas/update_feedback.json");
router.put("/:id", validation(update_feedback_schema), async function(req, res){
    const reqData = req.body;
    const id = req.params.id;
    try{
        const feedback = await feedbackRepo.update(id, reqData);
        res.json(response(feedback, 0, "success"));
    }catch (e) {
        logger.error("Update feedback error: %s", e);
        res.json(response({},-1,"something wrong"));
    }
})

// Delete feedback
router.delete("/:id", auth_role([owner]),async function(req, res){
    const id = req.params.id;
    try{
        const result = await feedbackRepo.remove(id);
        res.json(response(result,0,"success"));
    }catch (e) {
        logger.error("Delete feedback error: %s",e);
        res.json(response({}, -1,"something wrong"));
    }
})
module.exports = router;