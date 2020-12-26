module.exports = (sequelize, DataTypes) => {
    const WishList = sequelize.define('WishList', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
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
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'course',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        },
    },{
        tableName: 'wishList',
        underscored: true
    });
    WishList.removeAttribute("id");
    WishList.associate = (models) => {
        WishList.courses = WishList.belongsTo(
            models.Course,
            {
                foreignKey: 'course_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
        WishList.user = WishList.belongsTo(
            models.User,
            {
                foreignKey: 'user_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    }
    return WishList;
};