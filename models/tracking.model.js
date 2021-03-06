module.exports = (sequelize, DataTypes) => {
    const Tracking = sequelize.define(
      "Tracking",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        course_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "course",
            key: "id",
          },
          onUpdate: "cascade",
          onDelete: "cascade",
        },
        owner_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "tracking",
        underscored: true,
      }
    );
    Tracking.associate = (models) => {
        Tracking.user = Tracking.belongsTo(
            models.User,
            {
                foreignKey: 'id'
            }
        );
        Tracking.course = Tracking.belongsTo(models.Course, {
          foreignKey: "id",
          onUpdate: "cascade",
          onDelete: "cascade",
          hooks: true,
        });
    }
    return Tracking;
};