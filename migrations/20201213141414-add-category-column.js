'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'course',
        'category',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true
        }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'course',
        'category'
    )
  }
};
