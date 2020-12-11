module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token',  {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'token',
        underscored: true
    });

    Token.user = Token.belongsTo(
        models.User,
        {
            as: 'user',
            foreignKey: 'email',
            onDelete: 'cascade',
            hooks: true
        }
    );
    return Token;
};  