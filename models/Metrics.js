const S = require("sequelize");
const db = require("../config/index");

class Metrics extends S.Model {}

Metrics.init(
  {
    branchId: {
      type: S.INTEGER,
      allowNull: false,
    },
    date: {
      type: S.DATE,
      allowNull: false,
    },
    schedule: {
      type: S.TIME,
      allowNull: false,
    },
    reason: {
      type: S.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "metrics" }
);

module.exports = Metrics;
