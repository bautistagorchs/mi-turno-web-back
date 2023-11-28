const S = require("sequelize");
const db = require("../config/index");
const bcrypt = require("bcrypt");
class Appointment extends S.Model {}

Appointment.init(
  {
    reservationId: {
      type: S.STRING,
      allowNull: true,
    },
    userId: {
      type: S.INTEGER,
    },
    branchId: {
      type: S.INTEGER,
    },
    date: {
      type: S.DATE,
      allowNull: true,
    },
    schedule: {
      type: S.TIME,
    },
  },
  { sequelize: db, modelName: "appointment" }
);

Appointment.beforeCreate(async (appointment) => {
  try {
    const reservationId = Math.floor(
      Math.random() * (Math.pow(10, 13) - Math.pow(10, 12)) + Math.pow(10, 12)
    );
    appointment.reservationId = reservationId;
  } catch (error) {
    throw new Error("ERROR");
  }
});

module.exports = Appointment;
