const S = require("sequelize");
const db = require("../config/index");

class Shift extends S.Model {}

Shift.init(
  {
    reservationId: {
      type: S.INTEGER,
      allowNull: false,
    },
    userId: {
      type: S.INTEGER,
      allowNull: false,
    },
    branchId: {
      type: S.INTEGER,
      allowNull: false,
    },
    branchName: {
      type: S.STRING,
      allowNull: false,
    },
    date: {
      type: S.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "shifts" }
);

module.exports = Shift;
