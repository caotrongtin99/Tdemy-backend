module.exports = (sequelize, DataTypes) => {
    const WishList = sequelize.define('WishList', {
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
    },{
        tableName: 'wishLish',
        underscored: true
    });
    WishList.associate = (models) => {
        WishList.courses = WishList.hasMany(
            models.Course,
            {
                foreignKey: 'id',
                onDelete: 'cascade',
                hooks: true
            }
        );
        WishList.user = WishList.belongsTo(
            models.User,
            {
                foreignKey: 'id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    }
    return WishList;
};