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
    state: {
      type: S.STRING,
      defaultValue: "canceled",
    },
  },
  { sequelize: db, modelName: "metrics" }
);

module.exports = Metrics;
