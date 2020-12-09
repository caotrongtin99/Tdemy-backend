module.exports = (sequelize, DataTypes) => {
    const WishList = sequelize.define('wishList', {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    });
    return WishList;
};