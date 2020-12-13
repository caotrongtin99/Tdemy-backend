const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const randToken = require("rand-token");
const userRepo = require("../repository/user.repo");
const logger = require("../utils/log");
const auth_role = require("../middleware/auth.mdw").auth_role;
const redisClient = require("../utils/redis");
// const sendMail = require("../utils/mailer");
// const mailModel = require("../utils/mail.model");

// Get list user
router.get("/", auth_role([2]), async function (req, res) {
    try {
        const user = await userRepo.getAll();
        res.json(response(user, 0, "success"));
    } catch (e) {
        logger.error("Get Users error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
});

// Register route
const register_schema = require("../schemas/register.json");
router.post("/", validation(register_schema), async function (req, res) {
    const user = req.body;
    try {
        const userFind = await userRepo.getByEmail(user.email);
        if (userFind.length !== 0) {
            return res.json(response({}, 409, "email exist"));
        }
        const confirm_code = 'uc' + randToken.generate(80);
        const cacheCode = redisClient.hmset(confirm_code, user);
        const expireTime = redisClient.expire(confirm_code, process.env.CONFIRM_EXP || 86400);

        if (process.env.DEBUG === 'true') {
            let result = await userRepo.create(user);
            result = {...result.dataValues};
            delete result.password;
            return res.json(response(result, 0, "success"));
        } else if (cacheCode && expireTime) {
            logger.info("Create confirm code");
            // sendMail(mailModel);
            return res.json(response({}, 0, "Please check your mail and confirm register"));
        }
        throw 'Save confirm redis fail';
    } catch (e) {
        logger.error('Register error: ', e);
        res.json(response({}, -1, "something wrong"));
    }
});

// Confirm route
router.all("/confirm", async function (req, res) {
    const confirm_code = req.query.code;
    if (confirm_code) {
        // Check confirm code in redis
        redisClient.hgetall(confirm_code, async function (err, data) {
            // confirm code not exists
            if (err || data === null) {
                logger.info("Confirm code %s not exist in redis!", reqData.accessToken);
                return res.status(400).json(response({}, -1, "Confirm code not exits"));
            } else {
                logger.info("Confirm code data: %s", data);
                if (redisClient.del(confirm_code)) {
                    let result = await userRepo.create(data);
                    logger.info("Confirm and create user success");
                    result = {...result.dataValues};
                    delete result.password;
                    return res.status(201).json(response(result, 0, "Confirm success"));
                } else {
                    logger.error("Remove confirm code redis fail");
                    return res.status(500).json(response({}, -1, "something wrong"));
                }
            }
        });
    } else {
        logger.error("Confirm fail");
        res.json(response({}, -1, "confirm not valid"));
    }
})

// Get detail
router.get("/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const result = await userRepo.getById(id);
        res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Get user detail error", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Update
const update_schema = require("../schemas/update_user.json");
router.put("/:id", validation(update_schema), async function (req, res) {
    const id = req.params.id;
    const user = req.body;
    try {
        const isDeleted = redisClient.del(user.accessToken);
        if (isDeleted) {
            delete user.accessToken;
            delete user.refreshToken;
            const result = await userRepo.update(id, user);
            return res.json(response(result, 0, "success"));
        }
        throw 'error';
    } catch (e) {
        logger.error("Update user error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})

// Deactive
router.delete("/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const result = await userRepo.remove(id);
        res.json(response(result, 0, "success"));
    } catch (e) {
        logger.error("Delete user error: %s", e);
        res.json(response({}, -1, "something wrong"));
    }
})
module.exports = router;
