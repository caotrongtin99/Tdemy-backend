'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'tracking',
            'updated_at',
            {
                type: Sequelize.DATE,
                allowNull: false,
            },
        );
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('tracking', 'updated_at');
    }
};
