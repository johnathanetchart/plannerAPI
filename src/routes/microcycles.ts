import express from 'express';
import { Request, Response } from 'express';
import {
  findMicrocycle,
  getMicrocycles,
  addMicrocycle,
  updateMicrocycle,
  getSessionsForMicrocycle,
} from '../../db/index.js';

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    console.log('in microcycles GET route');
    try {
      const { username } = req.params;
      const { limit, offset } = req.query;
      const data = await getMicrocycles(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/:id/sessions', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await getSessionsForMicrocycle(id);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    console.log('In microcycles GET route for all microcycles.');
    try {
      const { limit, offset } = req.query;
      const data = await getMicrocycles(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In microcycles POST route.');
    try {
      const { username } = req.params;
      const { microcycle } = req.body;
      const data = await addMicrocycle(username, microcycle);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(409).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    const { microcycle } = req.body;
    console.log(microcycle);
    const { id, date, deload, mesocycle_id, phase_id, user_id } = microcycle;
    if (
      id === undefined ||
      date === undefined ||
      deload === undefined ||
      mesocycle_id === undefined ||
      phase_id === undefined ||
      user_id === undefined
    ) {
      res.status(400).send('Incomplete newMicrocycle object received.');
      return;
    }
    console.log(
      'In microcycles PUT route for updating microcycle with id',
      id + '.'
    );
    try {
      await updateMicrocycle(microcycle);
      const updatedMicrocycle = await findMicrocycle(id);
      res.status(200).send(updatedMicrocycle);
    } catch (err) {
      console.error(err);
      res.status(304).send(err);
    }
  });

export default router;
