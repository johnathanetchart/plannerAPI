import express from 'express';
import { Request, Response } from 'express';
import { findPhase, getPhases, addPhase, updatePhase } from '../../db/index.js';

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    console.log('In phases GET route for user', req.params.username);
    try {
      const { username } = req.params;
      const { limit, offset } = req.query;
      let data = await getPhases(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/:username/:id', async (req: Request, res: Response) => {
    console.log('In phases GET route for user', req.params.username);
    try {
      const { username, id } = req.params;
      let data = await findPhase(id);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    console.log('In phases GET route for getting all phases.');
    const { limit, offset } = req.query;
    try {
      let data = await getPhases(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In phases POST route.');
    try {
      const { username } = req.params;
      const { phase } = req.body;
      const { name, date } = phase;
      if (name === undefined) {
        res.status(400).send('Incomplete phase object received.');
        return;
      }
      let data = await addPhase(username, phase);
      res.status(201).send(data);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    console.log('In phases PUT route.');
    try {
      const { phase } = req.body;
      const { id, date, user_id, name } = phase;
      if (
        id === undefined ||
        name === undefined ||
        user_id === undefined ||
        date === undefined
      ) {
        res.status(400).send('Incomplete phase object received.');
        return;
      }
      await updatePhase(phase);
      const updatedPhase = await findPhase(id);
      res.status(200).send(updatedPhase);
    } catch (err) {
      console.error(err);
      res.status(304).send(err);
    }
  });

export default router;
