const ApiError = require("../utils/apiError");
const Product = require("../models/product");

const checkOwnership = () => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const productId = req.params.id;

      const product = await Product.findByPk(productId, {
        include: ["Shop"],
      });

      if (!product) {
        next(new ApiError("Product tidak ditemukan", 404));
      }

      if (product.Shop.userId === userId) {
        req.product = product;
        next();
      } else {
        next(new ApiError("Kamu tidak berkepentingan disini"), 403);
      }
      next();
    } catch (err) {
      next(new ApiError(err.message, 500));
    }
  };
};

module.exports = checkOwnership;
