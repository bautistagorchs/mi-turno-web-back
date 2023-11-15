const S = require("sequelize");
const db = require("../config/index");

class User extends S.Model {}

User.init(
  {
    nameAndLast_name: {
      type: S.STRING,
      allowNull: false,
    },
    DNI: {
      type: S.INTEGER,
      allowNull: false,
    },
    email: {
      type: S.STRING,
      allowNull: false,
      unique: true,
    },
    branch: {
      type: S.STRING,
    },
    isAdmin: {
      type: S.BOOLEAN,
      defaultValue: false,
    },
    isOperator: {
      type: S.BOOLEAN,
      defaultValue: false,
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

module.exports = User;
