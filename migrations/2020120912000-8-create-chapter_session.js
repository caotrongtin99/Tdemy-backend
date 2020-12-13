'use strict';
module.exports = {
    up: async (queryInterface, DataTypes) => {
        await queryInterface.createTable("enroll", {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
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
            chapter_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'chapter',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            cur_pos:{
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("enroll");
    }
};