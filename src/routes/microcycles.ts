const express = require('express');
import { Request, Response } from 'express';
const {
  findMicrocycle,
  getMicrocycles,
  addMicrocycle,
  updateMicrocycle,
} = require('../../db/index.js');

const router = express.Router();

router
  .get('/:username/:microcycleId', async (req: Request, res: Response) => {
    console.log('in microcycle GET route');
    try {
      const data = await findMicrocycle(req.params.microcycleId);
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
    console.log('in microcycles GET route');
    try {
      const { username } = req.params;
      const { limit, offset } = req.query;
      const data = await getMicrocycles(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('in microcycles POST route');
    try {
      const { username } = req.params;
      let { newMicrocycle } = req.body; //newMicrocycle object
      // console.log(newMicrocycle);
      // console.log(username);
      const data = await addMicrocycle(username, newMicrocycle);
      res.status(200).send(data);
    } catch (err) {
      res.status(409).send(err);
    }
  })

  .put('/:username', async (req: Request, res: Response) => {
    //TODO refactor to accept only full object
    const { updatedMicrocycle } = req.body;
    console.log(updatedMicrocycle);
    const { id, date, deload, mesocycleId, phaseId, userId } =
      updatedMicrocycle;
    if (
      id === undefined ||
      date === undefined ||
      deload === undefined ||
      mesocycleId === undefined ||
      phaseId === undefined ||
      userId === undefined
    ) {
      res.status(400).send('Incomplete microcycle object received.');
      return;
    }
    console.log('updating microcycle with id', id);
    try {
      const data = await updateMicrocycle(updatedMicrocycle);
      const updatedPhase = await findMicrocycle(id);
      res.status(200).send(updatedPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
