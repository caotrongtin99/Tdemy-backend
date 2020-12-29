module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        user_id:{
            type: DataTypes.UUID,
            allowNull: false,
        },
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
                foreignKey: 'email',
                onUpdate: 'cascade',
                onDelete: 'cascade',
                hooks: true
            }
        );
        Token.user = Token.belongsTo(models.User,
            {
                foreignKey: 'user_id',
                onUpdate: 'cascade',
                onDelete: 'cascade',
                hooks: true
            })
    }
    return Token;
};  