const Sequelize = require('sequelize');
const mysql2 = require('mysql2'); // Needed to fix sequelize issues with WebPack

let sequelize;
try {
  sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
      port: process.env.MYSQL_PORT,
    }
  );
} catch (error) {
  console.log(error);
}
var initModels = require('../models/init-models');
let models;
try {
  models = initModels(sequelize);
} catch (error) {
  console.log(error);
}

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
      reject(err);
    }
  });
};

const createUser = async (newUser) => {
  const { name, weight } = newUser;
  console.log('username', name, 'weight', weight);
  return new Promise(async (resolve, reject) => {
    try {
      let existingUser = await findUser(name);
      if (existingUser) {
        reject('Username exists');
      }
      const createdUser = await models.Users.create({
        name,
        weight: Number(weight) || 0,
      });
      resolve(createdUser);
    } catch (err) {
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
      reject(err);
    }
  });
};

const findPhase = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const phase = models.Phase.findOne({
        where: { id: Number(id) },
        include: {
          model: models.Mesocycle,
          as: 'mesocycles',
          include: { model: models.Microcycle, as: 'microcycles' },
        },
        order: [
          ['date', 'DESC'],
          [{ model: models.Mesocycle, as: 'mesocycles' }, 'date', 'DESC'],
          [
            { model: models.Mesocycle, as: 'mesocycles' },
            { model: models.Microcycle, as: 'microcycles' },
            'date',
            'DESC',
          ],
        ],
      });
      resolve(phase);
    } catch (err) {
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
          order: [['date', 'DESC']],
        });
        resolve(phases);
      } catch (err) {
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
          order: [
            ['date', 'DESC'],
            [{ model: models.Microcycle, as: 'microcycles' }, 'date', 'DESC'],
          ],
          include: { model: models.Microcycle, as: 'microcycles' },
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(mesocycles);
      } catch (err) {
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
          include: { model: models.Sessions, as: 'sessions' },
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(microcycles);
      } catch (err) {
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
        user_id = id;
      }
      if (date === undefined) {
        date = getDate();
      }
      const microcycle = await models.Microcycle.create({
        date: date,
        deload: !!deload,
        mesocycle_id: mesocycle_id,
        phase_id: phase_id,
        user_id: user_id,
      });
      resolve(microcycle);
    } catch (err) {
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
        reject(err);
      }
    });
  }
};

const getSessionsForMicrocycle = async (id) => {
  try {
    const data = await models.Sessions.findAll({
      where: {
        microcycle_id: id,
      },
      include: { model: models.Sets, as: 'sets' },
    });
    return data;
  } catch (err) {
    return err;
  }
};

// get most frequent sessions for a user that appear more than 10 times in the last 30 days
const getMostFrequentSessions = async (username) => {
  try {
    let { id } = await findUser(username);
    const data = await models.Sessions.findAll({
      where: {
        user_id: id,
        // last 21 days (3 weeks)
        date: {
          [Sequelize.Op.gte]: new Date(
            new Date() - 21 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
      attributes: [
        'name',
        [sequelize.fn('COUNT', sequelize.col('name')), 'count'],
      ],
      group: ['name'],
      having: sequelize.literal('count >= 5'),
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'DESC']],
    });
    return data;
  } catch (err) {
    return err;
  }
};

const addSession = async (username, newSession) => {
  let { date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
    newSession;
  return new Promise(async (resolve, reject) => {
    try {
      if (user_id === undefined) {
        let { id } = await findUser(username);
        user_id = id;
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
      reject(err);
    }
  });
};

const updateSession = async (updatedSession) => {
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
      reject(err);
    }
  });
};

const findSet = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log('attempting to find set with id', id);
    try {
      const set = await models.Sets.findOne({
        where: {
          id: id,
        },
      });
      resolve(set);
    } catch (err) {
      reject(err);
    }
  });
};

const getSets = async (username, limit = 100, offset = 0) => {
  if (username !== undefined) {
    return new Promise(async (resolve, reject) => {
      try {
        let { id } = await findUser(username);
        const sets = await models.Sets.findAll({
          where: {
            user_id: id,
          },
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(sets);
      } catch (err) {
        reject(err);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const sets = await models.Sets.findAll({
          limit: Number(limit),
          offset: Number(offset),
        });
        resolve(sets);
      } catch (err) {
        reject(err);
      }
    });
  }
};

const getSetsForSession = async (id) => {
  try {
    const sets = await models.Sets.findAll({
      where: { session_id: id },
    });
    return sets;
  } catch (err) {
    return err;
  }
};

const addSet = (username, newSet) => {
  let { id, load, reps, session_id, user_id } = newSet;
  return new Promise(async (resolve, reject) => {
    try {
      if (user_id === undefined) {
        let { id } = await findUser(username);
        user_id = id;
      }
      const set = await models.Sets.create({
        load: Number(load),
        reps: Number(reps),
        session_id: Number(session_id),
        user_id: Number(user_id),
      });
      resolve(set);
    } catch (err) {
      reject(err);
    }
  });
};

const updateSet = (updatedSet) => {
  let { id, load, reps, session_id, user_id } = updatedSet;
  return new Promise(async (resolve, reject) => {
    try {
      const set = await models.Sets.update(
        {
          load: Number(load),
          reps: Number(reps),
          session_id: Number(session_id),
          user_id: Number(user_id),
        },
        {
          where: {
            id: Number(id),
          },
        }
      );
      resolve(set);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  models,
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
  getSessionsForMicrocycle,
  getMostFrequentSessions,
  addSession,
  updateSession,
  findSet,
  getSets,
  getSetsForSession,
  addSet,
  updateSet,
};
