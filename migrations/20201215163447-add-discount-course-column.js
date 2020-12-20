'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'course',
        'discount',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('course', 'discount');
  }
};
