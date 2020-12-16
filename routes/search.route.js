const router = require("express").Router({mergeParams: true});
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const feedbackRepo = require("../repository/feedback.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

router.post("/", async function(req, res){
    const {limit, offset} = req.query;
    const category = req.query.category;
    const fee = req.query.fee;
    const enroll = req.query.enroll;
    const update = req.query.update;

    res.json(response({},0,"success"));
})