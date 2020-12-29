const router = require("express").Router();
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Full text search TODO Mục 1.4
router.get("/", auth_role([]), async function (req, res) {
  try {
    const limit = req.query.limit || 1;
    const offset = req.query.offset || 0;
    const key = req.query.key;
    const fee = req.query.fee;
    const rating = req.query.rating;
    const authData = req.authData;
    console.log(req.query);
    let queryStr = '';
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
      if (str !== '')
        queryStr = `ORDER BY ${str}`;
    }

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, match =>`$${match}`);
    let data = await courseRepo.search(key, limit, offset, queryStr);
    data = {
      array: data.rows,
      count: data.count,
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
