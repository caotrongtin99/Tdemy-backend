const router = require("express").Router({mergeParams: true});
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const feedbackRepo = require("../repository/feedback.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

const state_schema = require("../schemas/video_state.json");
router.post('/', auth_role([]), validation(state_schema), async function(req, res){
    const authData = req.authData;
    const reqData = req.body;
    try{
        const chapter_id = reqData.chapter_id;
        const position = reqData.position;
        return res.json(response({}, 0 ,"success"));
    }catch(e){
        logger.info(`Save video state error ${e}`);
        return res.json(response({}, 500, "something wrong"));
    }
})