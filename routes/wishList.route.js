const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const wishListRepo = require("../repository/wishlist.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Get All wishlist
router.get("/", auth_role([0, 1]), async function (req, res) {
  const authData = req.authData;
  try {
    let wishlist = await wishListRepo.getAllByOwnerId(authData.owner_id);
    wishlist = {
      array: wishlist.rows,
      count: wishlist.count,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
    };
    res.json(response(wishlist, 0, "success"));
  } catch (e) {
    logger.error("Get all wishlist error: ", e);
  }
});

// Create new wishlist
const register_wishlist_schema = require("../schemas/register_wish_list.json");
router.post(
  "/",
  auth_role([0, 1]),
  validation(register_wishlist_schema),
  async function (req, res) {
    const reqData = req.body;
    const authData = req.authData;
    try {
      const isExist = await wishListRepo.checkExist(
        authData.owner_id,
        reqData.course_id
      );
      if (isExist) {
        return res.json(response({}, 409, "You had it in wishlist before"));
      }
      const wishlist = await wishListRepo.create({
        user_id: authData.owner_id,
        course_id: reqData.course_id,
      });
      res.json(response(wishlist, 0, "success"));
    } catch (e) {
      logger.error("Create new wishlist error: ", e);
      res.json(response({}, -1, "something wrong"));
    }
  }
);

// Delete wishlist
router.delete("/:id", auth_role([0, 1]), async function (req, res) {
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
    logger.error("Delete wishlist error: ", e);
    res.json(response({}, -1, "something wrong"));
  }
});
module.exports = router;
