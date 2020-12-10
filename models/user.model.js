module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ref_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'user',
        underscored: true
    });

    User.associate = (models) => {
        User.feedbacks = User.hasMany(
            models.Feedback,
            {
                as: 'feedbacks',
                foreignKey: 'owner_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
        User.wishlist = User.hasMany(
            models.WishList,
            {
                as: 'wishList',
                foreignKey: 'user_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
    }
    return User;
};