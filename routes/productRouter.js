const router = require("express").Router();

const Product = require("../controller/productController");

const upload = require("../middlewares/uploader");
const autentikasi = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");
const checkOwnership = require("../middlewares/checkOwnership");

router.post("/", autentikasi, upload.single("image"), Product.createProduct);
router.get("/", Product.findProducts);
router.get("/:id", Product.findProductById);
router.patch("/:id", autentikasi, checkRole("Owner"), Product.UpdateProduct);
router.delete("/:id", autentikasi, checkRole("Owner"), Product.deleteProduct);

module.exports = router;
