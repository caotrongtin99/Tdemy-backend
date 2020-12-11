module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        access_token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'token',
        underscored: true
    });
    Token.removeAttribute('id');
    Token.associate = (models) => {
        Token.user = Token.belongsTo(
            models.User,
            {
                as: 'user',
                foreignKey: 'email',
                onDelete: 'cascade',
                hooks: true
            }
        );
    }
    return Token;
};  