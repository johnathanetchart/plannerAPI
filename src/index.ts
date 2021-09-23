// import { Expression } from "../node_modules/typescript/lib/typescript";

const express = require('express');
import { Request, Response } from 'express';
const app = express();

// const router = express.router();
const userRoute = require('./routes/users');
const sessionRoute = require('./routes/sessions');
const phaseRoute = require('./routes/phases');
const mesocycleRoute = require('./routes/mesocycles');
const microcycleRoute = require('./routes/microcycles');

// const { findUser, getSessions } = require('../db/index.js');

const port = 7000;
app.use(express.json());

app.use('/users', userRoute); // POST new user, PUT update user
app.use('/sessions', sessionRoute); //include sets - just update the whole session
app.use('/phases', phaseRoute);
app.use('/mesocycles', mesocycleRoute);
app.use('/microcycles', microcycleRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello omahhhh');
});

// app.get('/users/:username', async (req : Request, res : Response) => {
//   try {
//     let data = await findUser(req.params.username);
//     res.status(200).send(data);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });

// app.get('/sessions/:username', async (req : Request, res : Response) => {

//   try {
//     const { limit, offset } = req.query;
//     // console.log(req.query);
//     let data = await getSessions(req.params.username, limit, offset);
//     res.status(200).send(data);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// });

app.listen(port, () => {
  console.log(`plannerAPI listening at http://localhost:${port}`);
});
