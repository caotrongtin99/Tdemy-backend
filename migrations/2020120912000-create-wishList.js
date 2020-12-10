'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('WishList', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code_id: {
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
    await queryInterface.dropTable('WishList');
  }
};