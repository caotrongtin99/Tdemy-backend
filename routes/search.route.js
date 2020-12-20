const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const courseRepo = require("../repository/course.repo");
const feedbackRepo = require("../repository/feedback.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Full text search
router.get("/", auth_role([]), async function (req, res) {
  const { limit, offset } = req.query;
  const category = req.query.category;
  const fee = req.query.fee;
  const enroll = req.query.enroll;
  const update = req.query.update;
  const authData = req.authData;
  console.log(req.query);
  let data = await courseRepo.getAll();
  data = {
    array: data.rows,
    count: data.count,
    accessToken: authData.accessToken,
    refreshToken: authData.refreshToken,
  };
  res.json(response(data, 0, "success"));
});
module.exports = router;
