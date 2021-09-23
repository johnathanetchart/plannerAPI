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
    console.log('In phases GET route for user', req.params.username);
    try {
      const { username } = req.params;
      const { limit, offset } = req.query;
      let data = await getPhases(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
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
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In phases POST route.');
    try {
      const { username } = req.params;
      const { newPhase } = req.body;
      const { name, date } = newPhase;
      if (name === undefined) {
        res.status(400).send('newPhase object incomplete.');
        return;
      }
      let data = await addPhase(username, newPhase);
      res.status(201).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    console.log('In phases PUT route.');
    try {
      const { updatedPhase } = req.body;
      const { id, date, user_id, name } = updatedPhase;
      if (
        id === undefined ||
        name === undefined ||
        user_id === undefined ||
        date === undefined
      ) {
        res.status(400).send('Incomplete newPhase object received.');
        return;
      }
      const data = await updatePhase(updatedPhase);
      const newPhase = await findPhase(id);
      res.status(200).send(newPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
