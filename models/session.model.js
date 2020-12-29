module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      chapter_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "chapter",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      cur_pos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      }
    },
    {
      tableName: "session",
      underscored: true,
    }
  );

  Session.associate = (models) => {
    Session.user_id = Session.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: 'cascade',
      onUpdate: 'cascade',
      hooks: true
    });
    Session.chapters = Session.belongsTo(models.Chapter, {
      foreignKey: "chapter_id",
      onUpdate: "cascade",
      onDelete: "cascade",
      hooks: true,
    });
  };

  return Session;
};
