require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const { generateSchema } = require('graphcraft')({});
const { models } = require('../db');

const userRoute = require('./routes/users');
const sessionRoute = require('./routes/sessions');
const phaseRoute = require('./routes/phases');
const mesocycleRoute = require('./routes/mesocycles');
const microcycleRoute = require('./routes/microcycles');
const setRoute = require('./routes/sets');

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

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `plannerAPI listening at http://localhost:${process.env.SERVER_PORT}`
  );
});
