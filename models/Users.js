const S = require("sequelize");
const db = require("../config/index");

class Users extends S.Model {}

Users.init(
  {
    name: {
      type: S.STRING,
      allowNull: false,
    },
    email: {
      type: S.STRING,
      allowNull: false,
      unique: true,
    },
    DNI: {
      type: S.INTEGER,
      allowNull: false,
    },
    password: {
      type: S.STRING,
      allowNull: false,
    },
    salt: {
      type: S.STRING,
    },
  },
  { sequelize: db, modelName: "users" }
);

module.exports = Users;
