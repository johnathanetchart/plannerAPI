require('dotenv').config();

const express = require('express');
const cors = require('cors');

const Sequelize = require('sequelize');
import { ApolloServer } from 'apollo-server';
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolvers');


var options = {
}


const { GraphQLSchema } = require('graphql');
const { generateSchema } = require('graphcraft')(options);
const { models } = require('../db');

import { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
const app = express();

const userRoute = require('./routes/users');
const sessionRoute = require('./routes/sessions');
const phaseRoute = require('./routes/phases');
const mesocycleRoute = require('./routes/mesocycles');
const microcycleRoute = require('./routes/microcycles');
const setRoute = require('./routes/sets');

const port = process.env.SERVER_PORT;
app.use(express.json());
app.use(cors());

app.use('/users', userRoute);
app.use('/sessions', sessionRoute);
app.use('/phases', phaseRoute);
app.use('/mesocycles', mesocycleRoute);
app.use('/microcycles', microcycleRoute);
app.use('/sets', setRoute);


app.use('/graphql', async (req, res) => {

  const schema = await generateSchema(models, req);

  return graphqlHTTP({
    schema: new GraphQLSchema(schema),
    graphiql: true
  })(req, res);

});


app.get('/', (req: Request, res: Response) => {
  res.send('Hello omahhhh');
});

// const gqlServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: { models },
// });

// gqlServer
//   .listen()
//   .then(({ url }) => console.log(`GraphQL Server is running on ${url}`));

app.listen(port, () => {
  console.log(`plannerAPI listening at http://localhost:${port}`);
});
