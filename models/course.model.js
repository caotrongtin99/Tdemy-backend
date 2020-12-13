module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
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
        category: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: -1,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rate: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        fee: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    }, {
        tableName: 'course',
        underscored: true
    });

    Course.associate = (models) => {
        Course.teacher = Course.belongsTo(
            models.User,
            {
                foreignKey: 'owner_id'
            }
        );
        Course.chapters = Course.hasMany(
            models.Chapter,
            {
                as: 'chapters',
                foreignKey: 'course_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    
        Course.feedbacks = Course.hasMany(
            models.Feedback,
            {
                as: 'feedbacks',
                foreignKey: 'course_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    };

    return Course;
};