const Branch = require("./Branch");
const Shift = require("./Shifts");
const User = require("./Users");

// Shift.hasOne(User, { as: "client" });
// User.hasMany(Shift, { as: "reservations" });
// Branch.hasMany(Shift, { as: "shifts" });

Branch.belongsTo(User, { as: "operator", foreignKey: "operatorId" });
Shift.belongsTo(User, { as: "createdBy", foreignKey: "userId" });
Shift.belongsTo(Branch, { as: "branch", foreignKey: "branchId" });

module.exports = { Branch, Shift, User };
