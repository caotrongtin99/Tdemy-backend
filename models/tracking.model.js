module.exports = (sequelize, DataTypes) => {
    const Tracking = sequelize.define('Tracking', {
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
            }
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
    }, {
        tableName: 'tracking',
        underscored: true
    });
    Tracking.associate = (models) => {
        Tracking.user = Tracking.belongsTo(
            models.User,
            {
                foreignKey: 'id'
            }
        );
        Tracking.course = Tracking.belongsTo(
            models.Course,
            {
                foreignKey: 'id'
            }
        )
    }
    return Tracking;
};