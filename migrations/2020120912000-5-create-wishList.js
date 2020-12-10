'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('wishList', {
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'user',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        },
        course_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'course',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
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
    await queryInterface.dropTable('wishList');
  }
};