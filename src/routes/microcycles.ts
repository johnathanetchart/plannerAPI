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
  .get('/', async (req: Request, res: Response) => {
    console.log('In microcycles GET route for all microcycles.');
    try {
      const { limit, offset } = req.query;
      const data = await getMicrocycles(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In microcycles POST route.');
    try {
      const { username } = req.params;
      let { newMicrocycle } = req.body;
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
    const { id, date, deload, mesocycle_id, phase_id, user_id } =
      updatedMicrocycle;
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
      const data = await updateMicrocycle(updatedMicrocycle);
      const newMicrocycle = await findMicrocycle(id);
      res.status(200).send(newMicrocycle);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
