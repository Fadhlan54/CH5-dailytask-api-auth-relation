const { User, Auth, Shop } = require("../models");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");

const createUser = async (req, res, next) => {
  try {
    const { name, age, address, email, password, role, confirmPassword } =
      req.body;

    // validasi untuk check apakah email nya udah ada
    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (user) {
      next(new ApiError("User email already taken", 400));
    }

    // minimum password length
    const passwordLength = password <= 8;
    if (passwordLength) {
      next(new ApiError("Minimum password must be 8 character", 400));
    }

    // minimum password length
    if (password !== confirmPassword) {
      next(new ApiError("password does not match", 400));
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, saltRounds);

    const newUser = await User.create({
      name,
      address,
      role,
      age,
    });
    const test = await Auth.create({
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      userId: newUser.id,
    });

    console.log(test);

    res.status(201).json({
      status: "Success",
      data: {
        ...newUser,
        email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const findUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: ["Auth", "Shop"],
    });

    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const showUserDetail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ["Auth", "Shop"],
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const UpdateUser = async (req, res, next) => {
  try {
    const { name, age, role, address, email, password, confirmPassword } =
      req.body;

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, saltRounds);

    const userUpdate = await User.update(
      {
        name,
        age,
        role,
        address,
      },
      {
        where: {
          id: req.payload.id,
        },
      }
    );
    const authUpdate = await Auth.update(
      {
        email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        userId: userUpdate.id,
      },
      {
        where: {
          email: req.payload.email,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      data: {
        id: userUpdate.id,
        name: userUpdate.name,
        age: userUpdate.age,
        address: userUpdate.address,
        role: userUpdate.role,
        email: authUpdate.email,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      next(new ApiError("User dengan id tersebut gak ada", 404));
    }

    await User.destroy({
      where: {
        id: req.user.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `sukses delete user ${user.name}`,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createUser,
  findUsers,
  showUserDetail,
  UpdateUser,
  deleteUser,
};
