const Sequelize = require('sequelize');
const sequelize = new Sequelize('workoutplanner', 'root', 'banana', {
  host: 'localhost',
  dialect: 'mysql',
});
var initModels = require('../models/init-models');
var models = initModels(sequelize);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const getDate = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

const findUser = async (username) => {
  return new Promise(async (resolve, reject) => {
    console.log('attempting to find user with name', username);
    try {
      const user = await models.Users.findOne({
        where: {
          name: username,
        },
      });
      resolve(user);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getUsers = async (limit = 100, offset = 0) => {
  return new Promise(async (resolve, reject) => {
    console.log('Getting all users.');
    try {
      const users = await models.Users.findAll({
        limit: Number(limit),
        offset: Number(offset),
      });
      resolve(users);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const createUser = async (newUser) => {
  const { username, weight } = newUser;
  console.log('username', username, 'weight', weight);
  return new Promise(async (resolve, reject) => {
    try {
      let existingUser = await findUser(username);
      if (existingUser) {
        reject('Username exists');
      }
      const createdUser = await models.Users.create({
        name: username,
        weight: Number(weight) || 0,
      });
      resolve(createdUser);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const updateUser = async (updatedUser) => {
  const { id, name, weight } = updatedUser;
  return new Promise(async (resolve, reject) => {
    try {
      const changedUser = await models.Users.update(
        {
          name: name,
          weight: weight,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const updatedUser = await findUser(name);
      resolve(updatedUser);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      reject(err);
    }
  });
};

const getPhases = async (username, limit = 100, offset = 0) => {
  if (username !== undefined) {
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
        console.error(err);
        reject(err);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        let phases = await models.Phase.findAll({
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(phases);
      } catch {
        console.error(err);
        reject(err);
      }
    });
  }
};
const addPhase = async (username, newPhase) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, date } = newPhase;
      let { id } = await findUser(username);
      if (date === undefined) {
        date = getDate();
      }
      const phase = await models.Phase.create({
        date: date,
        user_id: id,
        name: name,
      });
      resolve(phase);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const updatePhase = async (updatedPhase) => {
  const { id, date, user_id, name } = updatedPhase;
  return new Promise(async (resolve, reject) => {
    try {
      const phase = await models.Phase.update(
        {
          date: date, //if newDate isn't in the correct format, it still runs but won't update that field
          user_id: user_id,
          name: name,
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      resolve(phase);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const findMesocycle = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mesocycle = await models.Mesocycle.findOne({
        where: {
          id: id,
        },
      });
      resolve(mesocycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getMesocycles = async (username, limit = 100, offset = 0) => {
  if (username !== undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        let { id } = await findUser(username);
        const mesocycles = await models.Mesocycle.findAll({
          where: {
            user_id: id,
          },
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(mesocycles);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const mesocycles = await models.Mesocycle.findAll({
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(mesocycles);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
};

const addMesocycle = async (username, newMesocycle) => {
  let { date, phase_id, user_id } = newMesocycle;
  return new Promise(async (resolve, reject) => {
    try {
      if (user_id === undefined) {
        let { id } = await findUser(username);
        user_id = id;
      }
      if (date === undefined) {
        date = getDate();
      }

      const mesocycle = await models.Mesocycle.create({
        date: date,
        phase_id: phase_id,
        user_id: user_id,
      });
      resolve(mesocycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const updateMesocycle = async (updatedMesocycle) => {
  const { id, date, phase_id, user_id } = updatedMesocycle;
  return new Promise(async (resolve, reject) => {
    try {
      const mesocycle = await models.Mesocycle.update(
        {
          date: date, //if newDate isn't in the correct format, it still runs but won't update that field
          phase_id: Number(phase_id),
          user_id: Number(user_id),
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      resolve(mesocycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const findMicrocycle = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const microcycle = await models.Microcycle.findOne({
        where: {
          id: id,
        },
      });
      resolve(microcycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getMicrocycles = async (username, limit = 100, offset = 0) => {
  if (username !== undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        let { id } = await findUser(username);
        const microcycles = await models.Microcycle.findAll({
          where: {
            user_id: id,
          },
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(microcycles);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const microcycles = await models.Microcycle.findAll({
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(microcycles);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
};

const addMicrocycle = async (username, newMicrocycle) => {
  let { date, deload, mesocycle_id, phase_id, user_id } = newMicrocycle;
  return new Promise(async (resolve, reject) => {
    try {
      if (user_id === undefined) {
        let { id } = await findUser(username);
        userId = id;
      }
      if (date === undefined) {
        date = getDate();
      }
      const microcycle = await models.Microcycle.create({
        date: date,
        deload: deload,
        mesocycle_id: mesocycle_id,
        phase_id: phase_id,
        user_id: user_id,
      });
      resolve(microcycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const updateMicrocycle = async (newMicrocycle) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, date, deload, mesocycle_id, phase_id, user_id } =
        newMicrocycle;
      const microcycle = await models.Microcycle.update(
        {
          date: date, //if newDate isn't in the correct format, it still runs but won't update that field
          deload: deload,
          mesocycle_id: Number(mesocycle_id),
          phase_id: Number(phase_id),
          user_id: Number(user_id),
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      resolve(microcycle);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const findSession = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await models.Sessions.findOne({
        where: {
          id: id,
        },
      });
      resolve(session);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getSessions = async (username, limit = 100, offset = 0) => {
  if (username !== undefined) {
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
        console.error(err);
        reject(err);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const sessions = await models.Sessions.findAll({
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(sessions);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
};

const addSession = (username, newSession) => {
  let { date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
    newSession;
  return new Promise(async (resolve, reject) => {
    try {
      if (user_id === undefined) {
        let { id } = await findUser(username);
        userId = id;
      }
      if (date === undefined) {
        date = getDate();
      }
      const session = await models.Sessions.create({
        date: date,
        name: name,
        phase_id: phase_id,
        mesocycle_id: mesocycle_id,
        microcycle_id,
        user_id: user_id,
      });
      resolve(session);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const updateSession = (updatedSession) => {
  const { id, date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
    updatedSession;
  return new Promise(async (resolve, reject) => {
    try {
      const session = await models.Sessions.update(
        {
          date: date, //if newDate isn't in the correct format, it still runs but won't update that field
          name: name,
          phase_id: Number(phase_id),
          mesocycle_id: Number(mesocycle_id),
          microcycle_id: Number(microcycle_id),
          user_id: Number(user_id),
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      resolve(session);
    } catch (err) {
      console.error(err);
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
  getUsers,
  createUser,
  updateUser,
  findPhase,
  getPhases,
  addPhase,
  updatePhase,
  findMesocycle,
  getMesocycles,
  addMesocycle,
  updateMesocycle,
  findMicrocycle,
  getMicrocycles,
  addMicrocycle,
  updateMicrocycle,
  findSession,
  getSessions,
  addSession,
  updateSession,
};
