const router = require("express").Router();
const validation = require("../middleware/validation.mdw");
const response = require("../constants/response");
const categoryRepo = require("../repository/category.repo");
const courseRepo = require("../repository/course.repo");
const rand = require("rand-token");
const auth_role = require("../middleware/auth.mdw").auth_role;
const logger = require("../utils/log");

// Get All Category TODO Mục 1.1, 4.1
router.get("/", auth_role([]), async function (req, res) {
  const authData = req.authData;
  try {
    const category = await categoryRepo.getAll();
    res.json(response(category, 0, "success"));
  } catch (e) {
    logger.error(`Get all category error: ${e}`);
    return res.json(response({}, -1, "something wrong"));
  }
});
// Get All Category tree TODO Mục 1.1, 4.1
router.post("/tree", auth_role([]), async function (req, res) {
  const authData = req.authData;
  try {
    let category = await categoryRepo.getAllRoot();
    console.log(category);
    let categories = [];
    for (const cat of category.rows) {
      const leaves = await categoryRepo.getAllLeaf(cat.name);
      categories.push({
        ...cat.dataValues,
        subCount: leaves.count,
        subCat: leaves.rows,
      });
    }
    res.json(
      response({ rows: categories, count: category.count }, 0, "success")
    );
  } catch (e) {
    logger.error(`Get category tree error ${e}`);
    return res.json(response({}, -1, "something wrong"));
  }
});

// Create new category TODO Mục 4.1
const category_schema = require("../schemas/register_category.json");
router.post(
  "/",
  auth_role([2]),
  validation(category_schema),
  async function (req, res) {
    const reqData = req.body;
    const authData = req.authData;
    try {
      if (await categoryRepo.isExist(reqData.name)) {
        logger.info(
          `Create category fail: category ${reqData.name} was exist!`
        );
        return res.json(response({}, 409, "Category exist"));
      } else {
        const category = await categoryRepo.create(reqData);
        logger.info(`Create category ${reqData} success!`);
        return res.json(response(category, 0, "success"));
      }
    } catch (e) {
      logger.error(`Create new category error: ${e}`);
      return res.json(response({}, -1, "something wrong"));
    }
  }
);

// Update category TODO Mục 4.1
router.put(
  "/:name",
  auth_role([2]),
  validation(category_schema),
  async function (req, res) {
    const reqData = req.body;
    const name = req.params.name;
    const authData = req.authData;
    try {
      if (await categoryRepo.isExist(name)) {
        const category = await categoryRepo.update(name, reqData);
        logger.info(`Update category ${reqData} success`);
        return res.json(response(category, 0, "success"));
      } else {
        logger.info(`Update category fail: category ${name} was not exist!`);
        return res.json(response({}, 404, "Category not exist"));
      }
    } catch (e) {
      logger.error(`Update category error: ${e}`);
      return res.json(response({}, -1, "something wrong"));
    }
  }
);

// Delete category TODO Mục 4.1
router.delete("/:name", auth_role([2]), async function (req, res) {
  const name = req.params.name;
  const authData = req.authData;
  try {
    if (await categoryRepo.isExist(name)) {
      // const courses = await courseRepo.getByCategory(name);
      const category = await categoryRepo.remove(name);
      logger.info(`Delete category ${name} success`);
      return res.json(response(category, 0, "success"));
    } else {
      logger.info(`Delete category fail: category ${name} was not exist!`);
      return res.json(response({}, 404, "Category not exist"));
    }
  } catch (e) {
    logger.error(`Delete category error: ${e}`);
    return res.json(response({}, -1, "something wrong"));
  }
});
module.exports = router;
