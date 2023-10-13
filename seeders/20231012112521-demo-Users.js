"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        name: "fadhlan",
        age: 20,
        address: "Bogor",
        role: "Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Juki",
        age: 20,
        address: "Bekasi",
        role: "Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jojo",
        age: 20,
        address: "Bekasi",
        role: "Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kukuh",
        age: 22,
        address: "Bogor",
        role: "Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tipen",
        age: 22,
        address: "Bekasi",
        role: "Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertUsersToDB = await queryInterface.bulkInsert("Users", users, {
      returning: true,
    });

    const auths = insertUsersToDB.map((user) => ({
      email: `${user.name}@gmail.com`,
      password: bcrypt.hashSync(user.name, 10),
      confirmPassword: bcrypt.hashSync(user.name, 10),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Auths", auths);

    return true;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Auths", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
