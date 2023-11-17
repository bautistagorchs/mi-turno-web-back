const S = require("sequelize");
const db = require("../config/index");

class Appointment extends S.Model {}

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
    fullname: {
     type: S.STRING,
     allowNull: false,
    },
    branchName: {
      type: S.STRING,
      allowNull: false,
    },
    date: {
      type: S.DATEONLY,
      allowNull: false,
    },
    schedule:{
      type : S.TIME,
      allowNull: false,
    },
    telephone:{
      type : S.INTEGER,
      allowNull: false,
    },
    email: {
      type: S.STRING,
      allowNull: false,
    }
    
  },
  { sequelize: db, modelName: "appointment" }
);

module.exports = Appointment;
