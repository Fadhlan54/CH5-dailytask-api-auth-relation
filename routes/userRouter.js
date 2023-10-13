const router = require("express").Router();

const User = require("../controller/userControllers");

const autentikasi = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");

router.post("/", autentikasi, checkRole("Owner"), User.createUser);
router.get("/", autentikasi, User.findUsers);
router.get("/user-detail", autentikasi, User.showUserDetail);
router.patch("/edit", autentikasi, checkRole("Owner"), User.UpdateUser);
router.delete("/delete", autentikasi, checkRole("Owner"), User.deleteUser);

module.exports = router;
