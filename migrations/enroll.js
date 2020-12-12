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
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            course_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'course',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            }
        });
    },
    down: async (queryInterface, DataTypes) => {
        await queryInterface.dropTable("enroll");
    }
};