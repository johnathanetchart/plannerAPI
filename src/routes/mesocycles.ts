import express from 'express';
import { Request, Response } from 'express';
import {
  findMesocycle,
  getMesocycles,
  addMesocycle,
  updateMesocycle,
} from '../../db/index.js';

const router = express.Router();

router
  .get('/:username/:mesocycleId', async (req: Request, res: Response) => {
    const { mesocycleId } = req.params;
    console.log('In mesocycles GET route for mesocycleId', mesocycleId);
    try {
      const data = await findMesocycle(mesocycleId);
      if (data === null) {
        res.status(404).send('No entry found.');
      } else {
        res.status(200).send(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { limit, offset } = req.query;
    console.log('In mesocycles GET route for user', username + '.');
    try {
      const data = await getMesocycles(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    console.log('In mesocycles GET route for all mesocycles.');
    try {
      const data = await getMesocycles(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { mesocycle } = req.body;
    const { date, phase_id, user_id } = mesocycle;
    console.log('In mesocycles POST route for user', username + '.');
    try {
      const data = await addMesocycle(username, mesocycle);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(409).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    const { mesocycle } = req.body;
    const { id, date, phase_id, user_id } = mesocycle;
    if (
      id === undefined ||
      date === undefined ||
      phase_id === undefined ||
      user_id === undefined
    ) {
      res.status(400).send('Incomplete mesocycle object received.');
      return;
    }
    console.log(
      'In mesocycles PUT route to update mesocycle with id',
      id + '.'
    );
    try {
      await updateMesocycle(mesocycle);
      const updatedMesocycle = await findMesocycle(id);
      res.status(200).send(updatedMesocycle);
    } catch (err) {
      console.error(err);
      res.status(304).send(err);
    }
  });

export default router;
