const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const wishListRepo = require("../repository/wishlist.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;

// Get All wishlist TODO Mục 2.2
router.get("/", auth_role([0, 1, 2]), async function (req, res) {
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
    auth_role([0, 1, 2]),
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

// Delete wishlist TODO Mục 2.2
router.delete("/", auth_role([0, 1]), async function (req, res) {
    const course_id = req.body.course_id;
    const authData = req.authData;
    try {
        for (const id of course_id) {
            if (await wishListRepo.checkExist(authData.owner_id, id)) {
                await wishListRepo.remove(authData.owner_id, course_id);
            }
        }
        return res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Delete wishlist error: ", e);
        res.json(response({}, -1, "something wrong"));
    }
});
module.exports = router;
