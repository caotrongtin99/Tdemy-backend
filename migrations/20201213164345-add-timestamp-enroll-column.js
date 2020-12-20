'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(
                'enroll',
                'created_at',
                {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            ),
            queryInterface.addColumn(
                'enroll',
                'updated_at',
                {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            )]);
    },

    down: async (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('enroll','created_at'),
            queryInterface.removeColumn('enroll', 'updated_at')
        ]);
    }
};
