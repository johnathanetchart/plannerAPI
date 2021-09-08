const express = require('express');
import { Request, Response } from 'express';
const { findUser, createUser, updateUser } = require('../../db/index.js');

const router = express.Router();
// router.use(express.json());

router.get('/:username', async (req: Request, res: Response) => {
  console.log('in users GET route');
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req: Request, res: Response) => {
  console.log('in users POST route');
  try {
    let data = await createUser(req.body.name, req.body.weight);
    res.status(201).send(data);
  } catch (err) {
    res.status(409).send(err);
  }
});

router.put('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  console.log(username);
  const { newUsername, newWeight } = req.body;
  console.log('in PUT for users');
  try {
    const data = await updateUser(username, newUsername, newWeight);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
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
