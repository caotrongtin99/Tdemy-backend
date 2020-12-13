module.exports = (sequelize, DataTypes) => {
    const Enroll = sequelize.define('Enroll',{
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        }
    },{
        tableName: 'enroll',
        underscored: true
    });

    Enroll.associate = (models) => {
        Enroll.user = Enroll.belongsTo(
            models.User,
            {
                foreignKey: 'user_id'
            }
        );
        Enroll.course = Enroll.belongsTo(
            models.Course,
            {
                foreignKey: 'course_id'
            }
        );
    };

    return Enroll;
};