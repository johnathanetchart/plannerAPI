const express = require('express');
import { Request, Response } from 'express';
const {
  findSession,
  getSessions,
  addSession,
  updateSession,
} = require('../../db/index.js');

const router = express.Router();

router
  .get('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { limit, offset } = req.query;
    console.log('In sessions GET route for user', username + '.');
    try {
      let data = await getSessions(username, limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .get('/', async (req: Request, res: Response) => {
    const { limit, offset } = req.query;
    console.log('In sessions GET route for all sessions.');
    try {
      let data = await getSessions(limit, offset);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  /*
  `date` DATETIME NOT NULL,
	`name` varchar(255) NOT NULL,
	`phase_id` int NOT NULL,
	`mesocycle_id` int NOT NULL,
	`microcycle_id` int NOT NULL,
	`user_id` int NOT NULL,
  */
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In sessions POST route for', req.params.username + '.');
    const { username } = req.params;
    const { newSession } = req.body;
    const { date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
      newSession;
    if (
      name === undefined ||
      phase_id === undefined ||
      mesocycle_id === undefined ||
      microcycle_id === undefined
    ) {
      res.status(400).send('Incomplete newSession object received.');
      return;
    }
    try {
      let data = await addSession(username, newSession);
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    console.log('In sessions PUT route.');
    try {
      const { updatedSession } = req.body;
      const { id, date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
        updatedSession;
      if (
        id === undefined ||
        date === undefined ||
        name === undefined ||
        phase_id === undefined ||
        mesocycle_id === undefined ||
        microcycle_id === undefined ||
        user_id === undefined
      ) {
        res.status(400).send('Incomplete updatedSession object received.');
        return;
      }
      const data = await updateSession(updatedSession);
      const newSession = await findSession(id);
      res.status(200).send(newSession);
    } catch (err) {
      res.status(304).send(err);
    }
  });

module.exports = router;
