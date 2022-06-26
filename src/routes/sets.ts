import express from 'express';
import { Request, Response } from 'express';
import { findSet, getSets, addSet, updateSet } from '../../db/index.js';

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { limit, offset } = req.query;
    console.log('In sets GET route for user', username + '.');
    try {
      let data = await getSets(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    console.log('In sets GET route for all sets.');
    try {
      let data = await getSets(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })

  .post('/:username', async (req: Request, res: Response) => {
    console.log('In sets POST route for', req.params.username + '.');
    const { username } = req.params;
    const { set } = req.body;
    const { load, reps, session_id, user_id } = set;
    if (load === undefined || reps === undefined || session_id === undefined) {
      res.status(400).send('Incomplete set object received.');
      return;
    }
    try {
      let data = await addSet(username, set);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .put('/:id', async (req: Request, res: Response) => {
    console.log('In sets PUT route.');
    try {
      const { set } = req.body;
      const { id } = req.params;
      const { load, reps } = set;

      if (!load && !reps) {
        res.status(400).send('You must provide load and/or reps.');
      }

      const setToUpdate = await findSet(id);
      if (!setToUpdate) {
        res.status(404).send('This Set does not exist.');
      }

      setToUpdate.update(set);
      res.status(200).send(setToUpdate);
    } catch (err) {
      console.error(err);
      res.status(304).send(err);
    }
  });

export default router;
