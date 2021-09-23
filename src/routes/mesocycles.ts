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
    console.log('in mesocycle GET route');
    try {
      const data = await findMesocycle(req.params.mesocycleId);
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
    console.log('in mesocycles GET route');
    try {
      const { username } = req.params;
      const { limit, offset } = req.query;
      const data = await getMesocycles(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('in mesocycles POST route');
    try {
      const { username } = req.params;
      const { date, phaseId, userId } = req.body;
      const data = await addMesocycle(username, date, phaseId, userId);
      res.status(200).send(data);
    } catch (err) {
      res.status(409).send(err);
    }
  })
  .put('/:username', async (req: Request, res: Response) => {
    //TODO refactor to accept only full object
    const { newMesocycle } = req.body;
    const { id, date, phase_id, user_id } = newMesocycle;
    if (
      id === undefined ||
      date === undefined ||
      phase_id === undefined ||
      user_id === undefined
    ) {
      res.status(400).send('Incomplete newMesocycle object received.');
      return;
    }
    console.log('updating mesocycle with id', id);
    try {
      const data = await updateMesocycle(newMesocycle);
      const updatedPhase = await findMesocycle(id);
      res.status(200).send(updatedPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
