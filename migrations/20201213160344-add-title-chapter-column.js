'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'chapter',
        'title',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'chapter',
        'title'
    )
  }
};
