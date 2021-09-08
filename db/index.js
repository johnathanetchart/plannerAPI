const Sequelize = require('sequelize');
const sequelize = new Sequelize('workoutplanner', 'root', 'banana', {
  host: 'localhost',
  dialect: 'mysql',
});
var initModels = require('../models/init-models');
var models = initModels(sequelize);
// console.log(models);

// models.User.findAll({ where: { username: "tony" }}).then(...);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const findUser = async (username) => {
  return new Promise((resolve, reject) => {
    //try to change to async later
    try {
      const user = models.Users.findOne({
        where: {
          name: username,
        },
      });
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

const createUser = async (username, weight) => {
  console.log('name', username, 'weight', weight);
  return new Promise(async (resolve, reject) => {
    try {
      let existingUser = await findUser(username);
      if (existingUser) {
        reject('user exists');
      }
      const newUser = await models.Users.create({
        name: username,
        weight: Number(weight) || 0,
      });
      resolve(newUser);
    } catch (err) {
      reject(err);
    }
  });
};

const updateUser = async (username, newUsername, newWeight) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = await findUser(username);
      const changeUser = await models.Users.update(
        {
          name: newUsername,
          weight: newWeight,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const updatedUser = await findUser(newUsername || username);
      resolve(updatedUser);
    } catch (err) {
      reject(err);
    }
  });
};

const findPhase = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const phase = models.Phase.findOne({
        where: {
          id: Number(id),
        },
      });
      resolve(phase);
    } catch (err) {
      reject(err);
    }
  });
};

const getPhases = async (username, limit = 100, offset = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id } = await findUser(username);
      const phases = await models.Phase.findAll({
        where: {
          user_id: id,
        },
        limit: Number(limit),
        offset: Number(offset),
      });
      resolve(phases);
    } catch (err) {
      reject(err);
    }
  });
};
const addPhase = async (username, name = 'unnamed', date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id } = await findUser(username);
      if (date === undefined) {
        date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      const phase = await models.Phase.create({
        date: date,
        user_id: id,
        name: name,
      });
      resolve(phase);
    } catch (err) {
      reject(err);
    }
  });
};

const updatePhase = async (id, newName, newDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const { name, date } = phaseUpdates;
      const phase = await models.Phase.update(
        {
          name: newName,
          date: newDate, //if newDate isn't in the correct format, it still runs but won't update that field
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      // const updatedPhase = await findPhase(id);
      // console.log(updatedPhase);
      resolve(phase);
    } catch (err) {
      reject(err);
    }
  });
};
const getSessions = async (username, limit = 100, offset = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { id } = await findUser(username);
      const sessions = await models.Sessions.findAll({
        where: {
          user_id: id,
        },
        limit: Number(limit),
        offset: Number(offset),
      });

      resolve(sessions);
    } catch (err) {
      reject(err);
    }
  });
};

// let date = new Date().toISOString().slice(0, 19).replace('T', ' '); // date format
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
  createUser,
  updateUser,
  findPhase,
  getPhases,
  addPhase,
  updatePhase,
  getSessions,
};
