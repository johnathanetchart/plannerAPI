const db = require('../../db');

const resolvers = {
  Query: {
    async user(root, { id }, { models }) {
      return models.Users.findByPk(id);
    },
    allUsers: async (root, { limit, offset }, { models }) =>
      await db.getUsers(limit, offset),
  },
  Mutation: {
    createUser: async (root, { name, weight }, { models }) =>
      await db.createUser({ name, weight }),
    updateUser: async (root, { id, name, weight }, { models }) =>
      await db.updateUser({ id, name, weight }),
  },
};

module.exports = resolvers;
