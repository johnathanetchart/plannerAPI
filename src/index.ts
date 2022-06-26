require('dotenv').config();

import express from 'express';
const app = express();
import cors from 'cors';
import serverlessExpress from '@vendia/serverless-express';

import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
const { generateSchema } = require('graphcraft')({});
import { models } from '../db';

import userRoute from './routes/users';
import sessionRoute from './routes/sessions';
import phaseRoute from './routes/phases';
import mesocycleRoute from './routes/mesocycles';
import microcycleRoute from './routes/microcycles';
import setRoute from './routes/sets';

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
    graphiql: true,
  })(req, res);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.SERVER_PORT, async () => {
  console.log(
    `plannerAPI listening at http://localhost:${process.env.SERVER_PORT}`
  );
});

export const getHandler = serverlessExpress({ app });
export async function handler(event, context, callback) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[info]', 'Event', JSON.stringify(event));
  }

  return getHandler(event, context, () => {
    console.log('getHandler');
  });
}
