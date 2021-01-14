const router = require("express").Router();
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const enrollRepo = require("../repository/enroll.repo");
const trackingRepo = require("../repository/tracking.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Full text search TODO Mục 1.4
router.get("/", auth_role([]), async function (req, res) {
  try {
    const limit = req.query.limit || Number.parseInt(process.env.DEFAULT_LIMIT) || 10;
    const offset = req.query.offset || 0;
    const key = req.query.key;
    const fee = req.query.fee || null;
    const rating = req.query.rating || null;
    const authData = req.authData;
    logger.info(req.query);
    let queryStr = '';
    let subQueryStr = '';
    if (fee !== 'undefined' || rating !== 'undefined') {
      let str = '';
      if (fee !== 'undefined' && (fee === 'desc' || fee === 'asc'))
        str += `fee ${fee}`;
      if (rating !== 'undefined' && (rating === 'desc' || rating === 'asc')) {
        if (str !== '')
          str += `, rate ${rating}`;
        else
          str += `rate ${rating}`;
      }
      if (str !== ''){
        queryStr = `ORDER BY ${str}`;
        subQueryStr = `${str}`;
      }
    }
    logger.info(queryStr);
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, match =>`$${match}`);
    let data = await courseRepo.search(key, limit, offset, queryStr, subQueryStr);
    let dataRes = [];
    for (const course of data.rows) {
      const courseValue = course.dataValues;
      const enroll_count = await enrollRepo.countByCourseId(courseValue.id);
      const feedback_count = 0;
      let isEnroll =
        authData.owner_id !== null
          ? await enrollRepo.checkEnroll(authData.owner_id, courseValue.id)
          : false;
      let views = await trackingRepo.countByCourseId(courseValue.id);
      let course_data = {
        ...courseValue,
        feedback_count: feedback_count,
        enroll_count: enroll_count,
        isEnroll: isEnroll,
        views: views,
      };
      dataRes.push({ ...course_data });
    }
    data = {
      array: dataRes,
      count: data.count,
      totalCount: data.totalCount,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
    };
    return res.json(response(data, 0, "success"));
  }catch (e) {
    logger.info(`Search error ${e}`);
    return res.json(response({}, 500, "something wrong"))
  }
});
module.exports = router;
