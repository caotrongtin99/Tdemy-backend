module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback',{
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
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        img_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{
        tableName: 'feedback',
        underscored: true
    });

    Feedback.associate = (models) => {
        Feedback.user = Feedback.belongsTo(
            models.User,
            {
                as: 'user',
                foreignKey: 'owner_id'
            }
        );
        Feedback.course = Feedback.belongsTo(
            models.Course,
            {
                as: 'course',
                foreignKey: 'id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    };

    return Feedback;
};