module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      category: {
        type: DataTypes.ARRAY({
          type: DataTypes.STRING,
          references: {
            model: "category",
            key: "name",
          },
          onUpdate: "cascade",
          onDelete: "cascade"
        }),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING,
        defaultValue:
          "https://images.pexels.com/photos/5905516/pexels-photo-5905516.jpeg?cs=srgb&dl=pexels-katerina-holmes-5905516.jpg&fm=jpg",
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: -1,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fee: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      publish_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "course",
      underscored: true,
    }
  );

  Course.associate = (models) => {
    Course.teacher = Course.belongsTo(models.User, {
      foreignKey: "owner_id",
    });
    Course.chapters = Course.hasMany(models.Chapter, {
      as: "chapters",
      foreignKey: "course_id",
      onDelete: "cascade",
      hooks: true,
    });

    Course.feedbacks = Course.hasMany(models.Feedback, {
      as: "feedbacks",
      foreignKey: "course_id",
      onDelete: "cascade",
      hooks: true,
    });
    Course.enroll = Course.hasMany(models.Enroll, {
      as: "enrolls",
      foreignKey: "course_id",
      onDelete: "cascade",
      hooks: true,
    });
    Course.wishList = Course.hasMany(models.WishList, {
      as: "wishList",
      foreignKey: "course_id",
      onDelete: "cascade",
      hooks: true,
    });
  };

  return Course;
};
