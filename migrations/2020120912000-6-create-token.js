'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('token', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'user',
              key: 'email'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('token');
  }
};