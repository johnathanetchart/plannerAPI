const express = require('express');
import { Request, Response } from 'express';
const {
  findUser,
  getUsers,
  createUser,
  updateUser,
} = require('../../db/index.js');

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  console.log('Getting all users.');
  try {
    let data = await getUsers();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

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
  const { newUser } = req.body;
  try {
    let data = await createUser(newUser);
    res.status(201).send(data);
  } catch (err) {
    res.status(409).send(err);
  }
});

router.put('/', async (req: Request, res: Response) => {
  console.log('in PUT for users');
  const { updatedUser } = req.body;
  const { id, username, weight } = updatedUser;
  if (id === undefined || username === undefined || weight === undefined) {
    res.status(400).send('Incomplete updatedUser object received.');
    return;
  }
  console.log(username);
  console.log(weight);
  try {
    const data = await updateUser(updatedUser);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
