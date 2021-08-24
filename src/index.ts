import { Expression } from "../node_modules/typescript/lib/typescript";

const express = require('express');
import {Request, Response} from 'express';
const app = express();

// const router = express.router();
// const routes = require('./routes');

const { findUser, getSessions } = require('../db/index.js');

const port = 3000;
app.use(express.json());

// app.use('/users', routes);
// app.use('/sessions', routes);

app.get('/', (req : Request, res : Response) => {
  res.send('Hello omahhhh')
})

app.get('/users/:username', async (req : Request, res : Response) => {
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.get('/sessions/:username', async (req : Request, res : Response) => {

  try {
    const { limit, offset } = req.query;
    // console.log(req.query);
    let data = await getSessions(req.params.username, limit, offset);
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send(err);
  }
});


app.listen(port, () => {
  console.log(`plannerAPI listening at http://localhost:${port}`)
});
