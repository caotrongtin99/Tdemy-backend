"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("course", "description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("course", "short_description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn("chapter", "description", {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
