var DataTypes = require("sequelize").DataTypes;
var _Mesocycle = require("./Mesocycle");
var _Microcycle = require("./Microcycle");
var _Phase = require("./Phase");
var _Sessions = require("./Sessions");
var _Sets = require("./Sets");
var _Users = require("./Users");

function initModels(sequelize) {
  var Mesocycle = _Mesocycle(sequelize, DataTypes);
  var Microcycle = _Microcycle(sequelize, DataTypes);
  var Phase = _Phase(sequelize, DataTypes);
  var Sessions = _Sessions(sequelize, DataTypes);
  var Sets = _Sets(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Sessions.belongsTo(Mesocycle, { as: "mesocycle", foreignKey: "mesocycle_id"});
  Mesocycle.hasMany(Sessions, { as: "Sessions", foreignKey: "mesocycle_id"});
  Sessions.belongsTo(Microcycle, { as: "microcycle", foreignKey: "microcycle_id"});
  Microcycle.hasMany(Sessions, { as: "Sessions", foreignKey: "microcycle_id"});
  Sessions.belongsTo(Phase, { as: "phase", foreignKey: "phase_id"});
  Phase.hasMany(Sessions, { as: "Sessions", foreignKey: "phase_id"});
  Sets.belongsTo(Sessions, { as: "session", foreignKey: "session_id"});
  Sessions.hasMany(Sets, { as: "Sets", foreignKey: "session_id"});
  Sessions.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Sessions, { as: "Sessions", foreignKey: "user_id"});

  return {
    Mesocycle,
    Microcycle,
    Phase,
    Sessions,
    Sets,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
