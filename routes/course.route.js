const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const chapterRepo = require("../repository/chapter.repo");
const enrollRepo = require("../repository/enroll.repo");
const trackingRepo = require("../repository/tracking.repo");
const feedbackRepo = require("../repository/feedback.repo");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const rand = require("rand-token");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Nested chapter
router.use('/:id/chapters', require("./chapter.route"));
// Nested feedback
router.use('/:id/feedback', require("./feedback.route"));

// Get All course
router.post("/", auth_role([]), async function (req, res) {
    const limit = req.query.limit || 1000;
    const offset = req.query.offset || 0;
    const type = req.body.type || "";
    const value = req.body.value || "";
    const authData = req.authData;
    try {
        let data = [];
        let courses;
        switch (type) {
            case "student":
                let course_enroll = [];
                const enrollList = await enrollRepo.getCourseByUserId(value);
                for(const enroll of enrollList.rows){
                    const course = await courseRepo.getById(enroll.course_id);
                    course_enroll.push(course);
                }
                courses = {
                    count: enrollList.count,
                    rows: course_enroll
                }
                break;
            case "teacher":
                courses = await courseRepo.getAllByOwnerId(value, limit, offset);
                break;
            case "view":
                let most_view_course = [];
                let courses_list = await trackingRepo.getMostView(limit, offset);
                for(const view of courses_list){
                    const course = await courseRepo.getById(view.course_id);
                    most_view_course.push(course);
                }
                courses = {
                    rows: most_view_course,
                    count: most_view_course.length
                }
                break;
            case "category":
                let category = value.split(',');
                courses = await courseRepo.getByCategory(category, limit, offset);
                break;
            case "enroll":
                let most_enroll_course = [];
                courses = await enrollRepo.getMostEnroll(limit, offset);
                for(const enroll of courses){
                    const course = await courseRepo.getById(enroll.course_id);
                    most_enroll_course.push(course);
                }
                courses = {
                    rows: most_enroll_course,
                    count: most_enroll_course.length
                }
                break;
            case "new":
                courses = await courseRepo.getLatest(limit, offset);
                break;
            default:
                courses = await courseRepo.getAll(limit, offset);
        }

        for (const course of courses.rows) {
            const chapter_count = await chapterRepo.countByCourseId(course.id);
            const enroll_count = await enrollRepo.countByCourseId(course.id);
            const feedback_count = 0;
            let isEnroll = authData.owner_id !== null ? await enrollRepo.checkEnroll(authData.owner_id, course.id): false;

            let course_data = { ...course.dataValues, feedback_count:feedback_count, chapter_count: chapter_count, owner_name: course.User.name, enroll_count: enroll_count, isEnroll: isEnroll };
            delete course_data.User;
            data.push(course_data);
        }
        const result = {
            array: data,
            type: type,
            count: courses.count,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        }
        return res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Get all course error: ", e);
    }
    res.json(response({}, -1, "something wrong"));
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
            ...result.dataValues,
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
        if(!course){
            return res.json(response({},404,"Course not found"));
        }
        const isEnroll = authData.owner_id !== null ? await enrollRepo.checkEnroll(authData.owner_id, course.id): false;
        let chapter_list = await chapterRepo.getAllByCourseId(id);
        if(isEnroll === false) {
            for(let chapter of chapter_list.rows) {
                if(chapter.status === 1) {
                    chapter.video_url = '';
                    chapter.description = 'Please Enroll to view the content';
                    chapter.duration = 0;
                }
            }
        }
        const feedback = await feedbackRepo.getAllByCourseId(id);
        const enroll_count = await enrollRepo.countByCourseId(id);
        
        let data = {
            ...course.dataValues,
            owner_name: course.User.name,
            enroll_count: enroll_count,
            isEnroll: isEnroll,
            chapter_count: chapter_list.count,
            chapters: chapter_list.rows,
            feedback: feedback.rows,
            feedback_count: feedback.count,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        };
        let user = {...data.User.dataValues};
        delete data.User;
        data = {...data, teacher: user};
        await trackingRepo.create({
            owner_id: authData.owner_id,
            course_id: id,
            type: "view"
        })
        return res.json(response(data, 0, "success"));
    } catch (e) {
        logger.error("Get detail course error: ", e);
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
            if(reqData.status !== null && reqData.status === 1){
                reqData.publish_at = require('sequelize').fn('NOW');
            }
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
        logger.error("Delete course error: ", e);
        return res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;