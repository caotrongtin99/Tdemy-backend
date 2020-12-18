'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'course',
        'publish_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('course', 'publish_at');
  }
};
