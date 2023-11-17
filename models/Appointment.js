const S = require("sequelize");
const db = require("../config/index");

class Appointment extends S.Model { }

Appointment.init(
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
      type: S.DATE,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "appointment" }
);

module.exports = Appointment;
