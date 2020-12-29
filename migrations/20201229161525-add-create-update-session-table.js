"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("session", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("session", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("session", "created_at");
    await queryInterface.removeColumn("session", "updated_at");
  },
};
