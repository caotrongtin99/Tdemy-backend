"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("tracking", "tracking_course_id_fkey");
    await queryInterface.removeConstraint("tracking", "tracking_owner_id_fkey");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("tracking", "tracking_course_id_fkey");
    await queryInterface.removeConstraint("tracking", "tracking_owner_id_fkey");
  },
};
