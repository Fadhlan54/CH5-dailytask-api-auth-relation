const { Shop, Product } = require("../models");
const ApiError = require("../utils/apiError");

const createShop = async (req, res, next) => {
  try {
    const { name, productId } = req.body;

    // validasi untuk check apakah email nya udah ada
    const shop = await Shop.findOne({
      where: {
        name,
      },
    });

    if (shop) {
      next(new ApiError("Shop already exists", 400));
    }

    const newShop = await Shop.create({
      name,
      productId,
      userId: req.user.id,
    });

    res.status(201).json({
      status: "Success",
      data: newShop,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const findShops = async (req, res, next) => {
  try {
    const shops = await Shop.findAll({
      include: ["Product", "User"],
    });

    res.status(200).json({
      status: "Success",
      data: {
        shops,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: ["Product", "User"],
    });

    res.status(200).json({
      status: "Success",
      data: {
        shop,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const UpdateShop = async (req, res, next) => {
  const { name, age, role, address } = req.body;
  try {
    const shop = await Shop.update(
      {
        name,
        age,
        role,
        address,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update shop",
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!shop) {
      next(new ApiError("Shop dengan id tersebut gak ada", 404));
    }

    await Shop.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete shop",
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createShop,
  findShops,
  findShopById,
  UpdateShop,
  deleteShop,
};
