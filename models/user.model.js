module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
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
                defaultValue: 0,
                allowNull: false,
            },
            avatar_url: {
                type: DataTypes.STRING,
                defaultValue: 'https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?cs=srgb&dl=pexels-katerina-holmes-5905516.jpg&fm=jpg',
                allowNull: true,
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
                allowNull: false,
            },
            ref_token: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
        },
        {
            tableName: "user",
            underscored: true,
        }
    );

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
        User.course = User.hasMany(
            models.Course,
            {
                as: 'courses',
                foreignKey: 'owner_id',
                onDelete: 'cascade',
                hooks: true
            }
        );
        User.enroll = User.hasMany(
            models.Enroll,
            {
                as: 'enrolls',
                foreignKey: 'user_id',
                onDelete: 'cascade',
                hooks: true
            }
        )
    }
    return User;
};