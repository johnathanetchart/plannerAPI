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
  .put('/:username/:mesocycleId', async (req: Request, res: Response) => {
    //TODO refactor to accept only full object
    const { mesocycleId } = req.params;
    const { newDate, newPhaseId, newUserId } = req.body;
    if (!(newDate || newPhaseId || newUserId)) {
      res.status(400).send('No changes requested.');
      return;
    }
    console.log('updating mesocycle with id', mesocycleId);
    try {
      const data = await updateMesocycle(
        mesocycleId,
        newDate,
        newPhaseId,
        newUserId
      );
      const updatedPhase = await findMesocycle(mesocycleId);
      res.status(200).send(updatedPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
