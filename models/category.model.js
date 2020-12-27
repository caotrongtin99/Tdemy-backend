module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "category",
          key: "name",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "category",
      underscored: true,
    }
  );

  Category.associate = (models) => {
    Category.path = Category.belongsTo(
      models.Category, {
      foreignKey: "path",
    });
  };

  return Category;
};
