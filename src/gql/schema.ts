import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: Int!
    weight: Int!
    name: String!
  }

  type Phase {
    id: Int!
    date: String!
    user_id: Int!
    name: String!
  }

  type Mesocycle {
    id: Int
    date: String!
    phase_id: Int!
    user_id: Int!
  }

  type Microcycle {
    id: Int!
    date: String!
    deload: Boolean
    mesocycle_id: Int!
    phase_id: Int!
    user_id: Int!
  }

  type Session {
    id: Int!
    date: String!
    name: String!
    microcycle_id: Int!
    mesocycle_id: Int!
    phase_id: Int!
    user_id: Int!
  }

  type Set {
    id: Int!
    load: Int!
    reps: Int!
    session_id: Int!
    user_id: Int!
  }

  type Query {
    user(id: Int!): User
    allUsers(limit: Int, offset: Int): [User]
  }

  type Mutation {
    createUser(name: String!, weight: Int!): User!
    updateUser(id: Int!, name: String!, weight: Int!): User!
  }
`;

export default typeDefs;
