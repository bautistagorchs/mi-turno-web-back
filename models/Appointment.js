const S = require("sequelize");
const db = require("../config/index");
const bcrypt = require("bcrypt");
class Appointment extends S.Model {}

Appointment.init(
  {
    reservationId: {
      type: S.STRING,
    },
    userId: {
      type: S.INTEGER,
    },
    branchId: {
      type: S.INTEGER,
    },

    branchName: {
      type: S.STRING,
    },
    date: {
      type: S.DATE,
    },
    schedule: {
      type: S.TIME,
    },
  },
  { sequelize: db, modelName: "appointment" }
);

Appointment.beforeCreate(async (appointment) => {
  try {
    const reservationId = await bcrypt.genSalt(13);
    appointment.reservationId = reservationId;
  } catch (error) {
    throw new Error("HASHING ERROR");
  }
});

module.exports = Appointment;
