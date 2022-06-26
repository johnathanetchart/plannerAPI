import express from 'express';
import { Request, Response } from 'express';
import { findUser, getUsers, createUser, updateUser } from '../../db/index.js';

const router = express.Router();

router
  .get('/', async (req: Request, res: Response) => {
    console.log('In users root GET route.');
    try {
      const { limit, offset } = req.query;
      const data = await getUsers(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    console.log('In users GET route for username', username + '.');
    try {
      const data = await findUser(username);
      if (!data) {
        res.status(404).send(`User: ${username} was not found.`);
      }
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .post('/', async (req: Request, res: Response) => {
    console.log('In users POST route.');
    const { user } = req.body;
    try {
      let data = await createUser(user);
      res.status(201).send(data);
    } catch (err) {
      console.error(err);
      res.status(409).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    console.log('In PUT for users.');
    const { user } = req.body;
    const { id, name, weight } = user;
    if (id === undefined || name === undefined || weight === undefined) {
      res.status(400).send('Incomplete updatedUser object received.');
      return;
    }
    try {
      const data = await updateUser(user);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  });

export default router;
