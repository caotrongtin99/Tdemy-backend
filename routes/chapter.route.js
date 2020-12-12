const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const chapterRepo = require("../repository/chapter.repo");
const logger = require("../utils/log");

// Get All chapter
router.get("/",async function (req, res) {
    try {
        // id, name, duration, status
        const chapter = await chapterRepo.getAll();
        res.json(response(chapter, 0, "success"));
    } catch (e) {
        logger.error("Get all chapter error: %s", e);
    }
});
// get preview

// Create new chapter
const register_chapter_schema = require("../schemas/register_chapter.json");
router.post("/", validation(register_chapter_schema), async function (req, res) {
    const reqData = req.body;
    try {
        const chapter = await chapterRepo.create(reqData);
        res.json(response(chapter, 0, "success"));
    } catch (e) {
        logger.error("Create new chapter error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update chapter
const update_chapter_schema = require("../schemas/update_chapter.json");
router.put("/:id", validation(update_chapter_schema), async function(req, res){
    const reqData = req.body;
    const id = req.params.id;
    try{
        const chapter = await chapterRepo.update(id, reqData);
        res.json(response(chapter, 0, "success"));
    }catch (e) {
        logger.error("Update chapter error: %s", e);
        res.json(response({},-1,"something wrong"));
    }
})

// Delete chapter
router.delete("/:id", async function(req, res){
    const id = req.params.id;
    try{
        const result = await chapterRepo.remove(id);
        res.json(response(result,0,"success"));
    }catch (e) {
        logger.error("Delete chapter error: %s",e);
        res.json(response({}, -1,"something wrong"));
    }
})
module.exports = router;