const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const chapterRepo = require("../repository/chapter.repo");
const enrollRepo = require("../repository/enroll.repo");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const rand = require("rand-token");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Nested chapter
router.use('/:id/chapters', require("./chapter.route"));
// Nested feedback
router.use('/:id/feedback', require("./feedback.route"));
// Enrollment
router.post('/:id/enroll', auth_role([0,1]), async function (req, res) {
    const course_id = req.params.id;
    const authData = req.authData;
    try{
        const course = await courseRepo.getById(course_id);
        if(course) {
            let data = {
                course_id: course_id,
                user_id: authData.owner_id
            }
            let enroll = await enrollRepo.create(data);
            enroll = {
                ...enroll,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
            return res.json(response(enroll, 0, "success"));
        }else{
            return res.json(response({},404,"Course not exist to enroll"));
        }
    }catch (e) {
        logger.error("Enroll to course error ", e);
        return res.json(response({},-1,"Enroll error"));
    }
})
// Get All course
router.post("/", auth_role([]), async function (req, res) {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const type = req.body.type;
    const type_id = req.body.type_id;
    try {
        let data = [];
        let courses;
        switch (type) {
            case "student":
                courses = await enrollRepo.getCourseByUserId(type_id ,limit, offset);
                courses = [...courses]
                break;
            case "teacher":
                courses = await courseRepo.getAllByOwnerId(type_id, limit, offset);
                break;
            default:
                courses = await courseRepo.getAll(limit, offset);
        }

        for (const course of courses) {
            const chapter_number = await chapterRepo.countByCourseId(course.id);
            const enroll = 0;
            const isEnroll = false;

            let course_data = {...course.dataValues, chapter_number: chapter_number, owner_name: course.User.name, enroll: enroll, isEnroll:isEnroll};
            delete course_data.User;
            data.push(course_data);
        }
        return res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get all course error: %s", e);
    }
    res.json(response({},-1,"something wrong"));
});

// Create new Course
const register_course_schema = require("../schemas/register_course.json");
router.post("/new", auth_role([1]), validation(register_course_schema), async function (req, res) {
    const reqData = req.body;
    const authData = req.authData;
    try {
        const course = {
            ...reqData,
            code: rand.generate(6),
            owner_id: authData.owner_id
        };
        let result = await courseRepo.create(course);
        result = {
            ...result,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        }
        return res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Create new Course error: ", e);
        return res.json(response({}, -1, "something wrong"));
    }
})

// Get detail course
router.get("/:id", auth_role([]), async function (req, res) {
    const id = req.params.id;
    const authData = req.authData;
    try {
        const course = await courseRepo.getById(id);
        const chapter_list = await chapterRepo.getAllByCourseId(id);
        const enroll = 0;
        const isEnroll = false;

        let data = {
            ...course.dataValues,
            owner_name: course.User.name,
            enroll:enroll,
            isEnroll:isEnroll,
            chapter_number: chapter_list.count,
            chapters: chapter_list.rows,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        };
        delete data.User;
        return res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get detail course error: %s", e);
        return res.json(response({}, -1, "something wrong"));
    }
})

// Update course
const update_course_schema = require("../schemas/update_course.json");
router.put("/:id", auth_role([1]), validation(update_course_schema), async function (req, res) {
    const reqData = req.body;
    const id = req.params.id;
    const authData = req.authData;
    try {
        let course = await courseRepo.getById(id);
        if (course && course.owner_id === authData.owner_id) {
            course = await courseRepo.update(id, reqData);
            course = {
                ...course,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
            return res.json(response(course, 0, "success"));
        } else {
            logger.info("Update course not have permission");
            return res.json(response({}, 400, "You do not have permission"));
        }
    } catch (e) {
        logger.error("Update course error: %s", e);
        return res.json(response({}, -1, "something wrong"));
    }
})

// Delete course
router.delete("/:id", auth_role([1, 2]), async function (req, res) {
    const id = req.params.id;
    const authData = req.authData;
    try {
        let course = await courseRepo.getById(id);
        if (course && course.owner_id === authData.owner_id) {
            let result = await courseRepo.remove(id);
            result = {
                ...result,
                accessToken: authData.accessToken,
                refreshToken: authData.refreshToken
            }
            return res.json(response(result, 0, "success"));
        } else {
            return res.json(response({}, 400, "You do not have "))
        }
    } catch (e) {
        logger.error("Delete course error: %s", e);
        return res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;