const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const wishListRepo = require("../repository/wishlist.repo");
const logger = require("../utils/log");

// Get All wishlist
router.get("/", auth_role([0,1]), async function (req, res) {
    const authData = req.authData;
    try {
        let wishlist = await wishListRepo.getAllByOwnerId(authData.owner_id);
        wishlist = {
            array: wishlist.rows,
            count: wishlist.count,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
        }
        res.json(response(wishlist, 0, "success"));
    } catch (e) {
        logger.error("Get all wishlist error: %s", e);
    }
});

// Create new wishlist
const register_wishlist_schema = require("../schemas/register_wish_list.json");
router.post("/", validation(register_wishlist_schema), async function (req, res) {
    const reqData = req.body;
    try {
        const wishlist = await wishListRepo.create(reqData);
        res.json(response(wishlist, 0, "success"));
    } catch (e) {
        logger.error("Create new wishlist error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Delete wishlist
router.delete("/:id", async function(req, res){
    const id = req.params.id;
    try{
        const result = await wishListRepo.remove(id);
        res.json(response(result,0,"success"));
    }catch (e) {
        logger.error("Delete wishlist error: %s",e);
        res.json(response({}, -1,"something wrong"));
    }
})
module.exports = router;