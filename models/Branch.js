const S = require("sequelize");
const db = require("../config/index");

class Branch extends S.Model {}

Branch.init(
  {
    name: {
      type: S.STRING,
      allowNull: false,
    },
    email: {
      type: S.STRING,
      allowNull: false,
    },
    telephone: {
      type: S.BIGINT,
      allowNull: false,
    },
    openingTime: {
      type: S.TIME,
      allowNull: false,
    },
    closingTime: {
      type: S.TIME,
      allowNull: false,
    },
    capacity: {
      type: S.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "branches" }
);

module.exports = Branch;
