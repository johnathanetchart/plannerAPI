
const Sequelize = require("sequelize");
const sequelize = new Sequelize("workoutplanner", "root", "banana", {
  host: "localhost",
  dialect: "mysql"
});
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// console.log(models);

// models.User.findAll({ where: { username: "tony" }}).then(...);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const findUser = (username) => {
  return new Promise((resolve, reject) => {
      models.Users.findOne({
      where: {
        name: username
      }
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

const getSessions = async (username, limit = 100, offset = 0) => {
  try {
    let { id } = await findUser(username);
    return new Promise(async (resolve, reject) => {
      const sessions = await models.Sessions.findAll({
        where: {
          user_id: id
        },
        limit: Number(limit),
        offset: Number(offset)
      })

      resolve(sessions);
    })
  } catch(err) {
    reject(err);
  }
};
const getPhases = async (username, limit = 100, offset = 0) => {
  try {
    let { id } = await findUser(username);
    return new Promise(async (resolve, reject) => {
      const phases = await models.Phase.findAll({
        where: {
          user_id: id
        },
        limit: Number(limit),
        offset: Number(offset)
      })
      resolve(phases);
    })
  } catch(err) {
    reject(err);
  }
};
const addPhase = async (username, name = 'unnamed', date) => {
  try {
    let { id } = await findUser(username);
    if(date === undefined) {
      date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    return new Promise(async (resolve, reject) => {
      const phase = await models.Phase.create({
        date: date,
        user_id: id,
        name: name
      })
      resolve(phase);
    })
  } catch(err) {
    reject(err);
  }
};

let date = new Date().toISOString().slice(0, 19).replace('T', ' '); // date format
// //add a phase for user 1
// models.Phase.create({
//   date: date,
//   user_id: 1
// })
// add a mesocycle
// models.Mesocycle.create({
//   date: date,
//   user_id: 1,
//   phase_id: 1
// })
// models.Microcycle.create({
//   date: date,
//   deload: 0,
//   mesocycle_id: 1,
//   phase_id: 1,
//   user_id: 1,
// })
// models.Sessions.create({
//   date: date,
//   microcycle_id: 1,
//   mesocycle_id: 1,
//   phase_id: 1,
//   user_id: 1,
//   name: "brolifts"
// })

module.exports = {
  findUser,
  getSessions,
  getPhases,
  addPhase
};