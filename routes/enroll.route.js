const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const enrollRepo = require("../repository/enroll.repo");
const courseRepo = require("../repository/course.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Get All enroll
router.get("/", auth_role([0, 1, 2]), async function (req, res) {
  const authData = req.authData;
  try {
    let enroll = await enrollRepo.getCourseByUserId(authData.owner_id);
    enroll = {
      array: enroll.rows,
      count: enroll.count,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
    };
    res.json(response(enroll, 0, "success"));
  } catch (e) {
    logger.error("Get all wishlist error: %s", e);
  }
});
// Enrollment TODO: Mục 2.3
const register_enroll_schema = require("../schemas/register_enroll.json");
router.post(
  "/",
  auth_role([0, 1, 2]),
  validation(register_enroll_schema),
  async function (req, res) {
    const reqData = req.body;
    const authData = req.authData;
    try {
      let enroll_res = [];
      let count = 0;
      for (const course_id of reqData.course_id) {
        let enroll = {};
        if ((await courseRepo.getById(course_id)) != null) {
          const enrollment = await enrollRepo.getEnroll(authData.owner_id, course_id);
          if (enrollment == null) {
            enroll = await enrollRepo.create({
              course_id: course_id,
              user_id: authData.owner_id,
            });
            enroll = {
              ...enroll.dataValues,
              code: 0,
              message: "Enroll to course success"
            };
            count += 1;
          } else {
            enroll = {
              ...enrollment.dataValues,
              code: 409,
              message: "You have enroll to this course"
            };
          }
          enroll_res.push(enroll);
        }
      }
      const result = {
        array: enroll_res,
        count: count,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      };
      return res.json(response(result, 0, "Success"));
    } catch (e) {
      logger.error("Enroll to course error ", e);
      return res.json(response({}, -1, "Enroll error"));
    }
  }
);
// Delete enroll
router.delete("/:id", auth_role([0, 1, 2]), async function (req, res) {
  const id = req.params.id;
  const authData = req.authData;
  try {
    const wishlist = await wishListRepo.getWishList(
      authData.owner_id,
      reqData.course_id
    );
    if (wishlist && wishlist.user_id === authData.owner_id) {
      const result = await wishListRepo.remove(id);
      return res.json(response(result, 0, "success"));
    } else {
      return res.json(response({}, 400, "You do not have permission"));
    }
  } catch (e) {
    logger.error("Delete wishlist error: %s", e);
    res.json(response({}, -1, "something wrong"));
  }
});
module.exports = router;
