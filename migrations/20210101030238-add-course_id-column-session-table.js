"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("session", "course_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "course",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("session", "course_id");
  },
};
