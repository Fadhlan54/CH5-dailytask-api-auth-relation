"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.belongsToMany(models.User, {
        through: "UserShop",
        as: "User",
      });
      Shop.belongsToMany(models.Product, {
        through: "ProductShop",
        as: "Product",
      });
    }
  }
  Shop.init(
    {
      name: DataTypes.STRING,
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Shop",
    }
  );
  return Shop;
};
