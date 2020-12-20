'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'course',
            'short_description',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('course', 'short_description');
    }
};
