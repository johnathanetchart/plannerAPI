const express = require('express');
import { Request, Response } from 'express';
const {
  findPhase,
  getPhases,
  addPhase,
  updatePhase,
} = require('../../db/index.js');

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    console.log('getting all sessions for', req.params.username);
    try {
      const { limit, offset } = req.query;
      let data = await getPhases(req.params.username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('adding a new phase for', req.params.username, req.body);
    try {
      const { name, date } = req.body;
      let data = await addPhase(req.params.username, name, date);
      res.status(201).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  })
  .put('/:phaseId', async (req: Request, res: Response) => {
    //TODO refactor to accept full object only
    const { phaseId } = req.params;
    const { newPhase, newName, newDate } = req.body;
    if (newName === undefined || newDate === undefined) {
      //check that newPhase object has all required details
      res.status(400).send('No changes requested.');
      return;
    }
    console.log('updating phase with id', phaseId);
    try {
      const data = await updatePhase(phaseId, newName, newDate);
      const updatedPhase = await findPhase(phaseId);
      res.status(200).send(updatedPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
