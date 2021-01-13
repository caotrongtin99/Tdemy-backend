const Course = require("../models").Course;
const { map } = require("lodash");
const User = require("../models").User;
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");


async function search(key, limit, offset, query, subQuery) {
  const results = await models.sequelize.query(
    `SELECT
      id, code, owner_id, name, avatar_url, status, description, rate, fee, created_at, updated_at, category, short_description, discount, publish_at
      From ${models.Course.tableName}
      WHERE 
      to_tsvector('english', name) @@ to_tsquery('english','${key}')
      or 
      category @> (ARRAY['${key}':: CHARACTER VARYING])
      ${query}
      LIMIT ${limit} OFFSET ${offset};
      `
    , {
      model: Course,
      mapToModel: true,
    }
  );
  let courses;
  if (subQuery) {
    courses = await Course.findAndCountAll({
      where: {
        id: map(results, "id"),
      },
      include: {
        model: User,
        attributes: ["id", "name", "avatar_url", "role", "status"],
      },
      order: [[sequelize.literal(subQuery)]],
    })
  } else {
    courses = await Course.findAndCountAll({
      where: {
        id: map(results, "id"),
      },
      include: {
        model: User,
        attributes: ["id", "name", "avatar_url", "role", "status"],
      }
    });
  }
  const count = await models.sequelize.query(
    `SELECT
      id, code, owner_id, name, avatar_url, status, description, rate, fee, created_at, updated_at, category, short_description, discount, publish_at
      From ${models.Course.tableName}
      WHERE 
      to_tsvector('english', name) @@ to_tsquery('english','${key}')
      or 
      category @> (ARRAY['${key}':: CHARACTER VARYING])
      ${query}
      LIMIT ALL;
      `,
    {
      model: Course,
      mapToModel: true,
    }
  );
  courses.totalCount = count.length;
  return courses;
}

async function countByTeacherId(id){
  return await Course.count({
    where: {
      owner_id: id,
    },
  });
}
async function getAll(limit, offset) {
  return await Course.findAndCountAll({
    limit: limit,
    offset: offset,
    include: {
      model: User,
      attributes: ['id', 'name', 'avatar_url', 'role', 'status']
    },
  });
}
async function getLatest(limit, offset) {
  return await Course.findAndCountAll({
    limit: limit,
    offset: offset,
    where: {
      created_at: {
        [Op.ne]: null,
      },
    },
    order: [["created_at", "DESC"]],
    include: {
      model: User,
      attributes: ['id', 'name', 'avatar_url', 'role', 'status']
    },
  });
}
async function getByCategory(category, limit, offset) {
  return await Course.findAndCountAll({
    where: {
      category: {
        [Op.contains]: [category],
      },
    },
    limit: limit,
    offset: offset,
    include: {
      model: User,
      attributes: ['id', 'name', 'avatar_url', 'role', 'status']
    },
  });
}

async function getCourseByStudentId(student_id, limit, offset) {
  return await Course.findAndCountAll({
    where: {
      owner_id: student_id,
    },
    limit: limit,
    offset: offset,
    include: {
      model: User,
      attributes: ['id', 'name', 'avatar_url', 'role', 'status']
    },
  });
}

async function getAllByOwnerId(teacher_id, limit, offset) {
  return await Course.findAndCountAll({
    where: {
      owner_id: teacher_id,
    },
    limit: limit,
    offset: offset,
    include: {
      model: User,
      attributes: ['id', 'name', 'avatar_url', 'role', 'status']
    },
  });
}

async function getById(id) {
  return await Course.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'avatar_url', 'role', 'status']
      },
    ],
  });
}

async function create(course) {
  return Course.create(course);
}

async function update(id, course) {
  return await Course.update(course, {
    where: {
      id: id,
    },
  });
}

async function remove(id) {
  return await Course.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  countByTeacherId,
  search,
  getByCategory,
  getLatest,
  getCourseByStudentId,
  getAllByOwnerId,
  getAll,
  getById,
  create,
  update,
  remove,
};
