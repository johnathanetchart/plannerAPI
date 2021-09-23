const express = require('express');
import { Request, Response } from 'express';
const {
  findMesocycle,
  getMesocycles,
  addMesocycle,
  updateMesocycle,
} = require('../../db/index.js');

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
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { newMesocycle } = req.body;
    const { date, phase_id, user_id } = newMesocycle;
    console.log('In mesocycles POST route for user', username + '.');
    try {
      const data = await addMesocycle(username, newMesocycle);
      res.status(200).send(data);
    } catch (err) {
      res.status(409).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    const { updatedMesocycle } = req.body;
    const { id, date, phase_id, user_id } = updatedMesocycle;
    if (
      id === undefined ||
      date === undefined ||
      phase_id === undefined ||
      user_id === undefined
    ) {
      res.status(400).send('Incomplete newMesocycle object received.');
      return;
    }
    console.log(
      'In mesocycles PUT route to update mesocycle with id',
      id + '.'
    );
    try {
      const data = await updateMesocycle(updatedMesocycle);
      const newMesocycle = await findMesocycle(id);
      res.status(200).send(newMesocycle);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
