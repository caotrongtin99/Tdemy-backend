module.exports = (sequelize, DataTypes) => {
    const FeedBack = sequelize.define('Feedback',{
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
            defaultValue: 0,
            allowNull: false,
        },
        img_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },{
        tableName: 'feedback',
        underscored: true
    });

    FeedBack.associate = (models) => {
        FeedBack.user = FeedBack.belongsTo(
            models.User,
            {
                foreignKey: 'id',
                onDelete: 'cascade',
                hooks: true
            }
        );
        FeedBack.course = FeedBack.belongsTo(
            models.Course,
            {
                foreignKey: 'id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    };

    return FeedBack;
};