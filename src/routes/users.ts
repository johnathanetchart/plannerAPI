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
  console.log('In users root GET route.');
  try {
    const { limit, offset } = req.query;
    const data = await getUsers(limit, offset);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  console.log('In users GET route for username', username + '.');
  try {
    const data = await findUser(username);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req: Request, res: Response) => {
  console.log('In users POST route.');
  const { newUser } = req.body;
  try {
    let data = await createUser(newUser);
    res.status(201).send(data);
  } catch (err) {
    res.status(409).send(err);
  }
});

router.put('/', async (req: Request, res: Response) => {
  console.log('In PUT for users.');
  const { updatedUser } = req.body;
  const { id, name, weight } = updatedUser;
  if (id === undefined || name === undefined || weight === undefined) {
    res.status(400).send('Incomplete updatedUser object received.');
    return;
  }
  try {
    const data = await updateUser(updatedUser);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
