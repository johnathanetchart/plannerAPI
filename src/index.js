const express = require('express');
const app = express();
// import { sequelize } from '../db';
// const db = require('../db');
const { findUser, getSessions } = require('../db/index.js');
// db.sequelize.sync();


const port = 3000
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello omahhhh')
})

app.get('/users/:username', async (req, res) => {
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.get('/sessions/:username', async (req, res) => {

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
