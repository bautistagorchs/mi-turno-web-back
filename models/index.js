const Branch = require("./Branch");
const User = require("./Users");
const Appointment = require("./Appointment");

// Shift.hasOne(User, { as: "client" });
// User.hasMany(Shift, { as: "reservations" });
// Branch.hasMany(Shift, { as: "shifts" });

Branch.belongsTo(User, { as: "operator", foreignKey: "operatorId" });
Appointment.belongsTo(User, { as: "createdBy", foreignKey: "userId" });
Appointment.belongsTo(Branch, { as: "branch", foreignKey: "branchId" });

module.exports = { Branch, Appointment, User };
