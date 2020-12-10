module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define('Chapter',  {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        duration: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        video_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'chapter',
        underscored: true
    });

    Chapter.associate = (models) => {
        Chapter.course = Chapter.belongsTo(
            models.Course,
            {
                as: 'course',
                foreignKey: 'course_id'
            }
        );
    };
    return Chapter;
};  