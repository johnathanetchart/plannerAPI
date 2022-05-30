const Sequelize = require('sequelize');
var DataTypes = require('sequelize').DataTypes;
var _Mesocycle = require('./Mesocycle');
var _Microcycle = require('./Microcycle');
var _Phase = require('./Phase');
var _Sessions = require('./Sessions');
var _Sets = require('./Sets');
var _Users = require('./Users');

function initModels(sequelize) {
  var Mesocycle = _Mesocycle(sequelize, DataTypes);
  var Microcycle = _Microcycle(sequelize, DataTypes);
  var Phase = _Phase(sequelize, DataTypes);
  var Sessions = _Sessions(sequelize, DataTypes);
  var Sets = _Sets(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);


  Phase.hasMany(Sessions, { as: 'sessions', foreignKey: 'phase_id' });
  Phase.hasMany(Microcycle, { as: 'microcycles', foreignKey: 'phase_id' });
  Phase.hasMany(Mesocycle, { as: 'mesocycles', foreignKey: 'phase_id' });
  Phase.belongsTo(Users, { as: 'user', foreignKey: 'user_id' });

  Users.hasMany(Phase, { as: 'phases', foreignKey: 'user_id' });
  Users.hasMany(Sessions, { as: 'sessions', foreignKey: 'user_id' });

  Mesocycle.hasMany(Sessions, { as: 'sessions', foreignKey: 'mesocycle_id' });
  Mesocycle.hasMany(Microcycle, { as: 'microcycles', foreignKey: 'mesocycle_id' });
  Mesocycle.belongsTo(Phase, { foreignKey: 'phase_id' });

  Microcycle.belongsTo(Mesocycle, { as: 'mesocycle', foreignKey: 'mesocycle_id' });
  Microcycle.hasMany(Sessions, { as: 'sessions', foreignKey: 'microcycle_id' });

  Sessions.hasMany(Sets, { as: 'sets', foreignKey: 'session_id' });
  Sessions.belongsTo(Microcycle, { as: 'microcycle', foreignKey: 'microcycle_id' });
  Sessions.belongsTo(Mesocycle, { as: 'mesocycle', foreignKey: 'mesocycle_id' });
  Sessions.belongsTo(Phase, { as: 'phase', foreignKey: 'phase_id' });
  Sessions.belongsTo(Users, { as: 'user', foreignKey: 'user_id' });

  Sets.belongsTo(Sessions, { as: 'session', foreignKey: 'session_id' });

  return {
    Mesocycle,
    Microcycle,
    Phase,
    Sessions,
    Sets,
    Users,
    Sequelize,
    sequelize
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
