const express = require('express');
import { Request, Response } from 'express';
const { getSessions } = require('../../db/index.js');

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { limit, offset } = req.query;
    console.log('In sessions GET route for user', username + '.');
    try {
      let data = await getSessions(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    console.log('In sessions GET route for all sessions.');
    try {
      let data = await getSessions(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('adding a session for', req.params.username);
    try {
      // const { limit, offset } = req.query;
      // console.log(req.query);
      // let data = await getSessions(req.params.username, limit, offset);
      // res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// async (req : Request, res : Response) => {
//   try {
//     let data = await findUser(req.params.username);
//     res.status(200).send(data);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// })

// .post()

module.exports = router;

/*
app.get('/users/:username', async (req : Request, res : Response) => {
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send(err);
  }
});
*/
