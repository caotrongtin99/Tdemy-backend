const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");

router.get("/", async function (req, res) {
    const course = await courseRepo.getAll();
    res.json(response(course, 0, "success"));
});

router.post("/", async function(req, res){
    res.json(response({},0,"success"));
})