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
        title:{
            type: DataTypes.STRING,
            allowNull: true,
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
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        video_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
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
                foreignKey: 'id'
            }
        );
    };
    return Chapter;
};  