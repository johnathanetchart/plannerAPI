const express = require('express');
import { Request, Response } from 'express';
const {
  findSession,
  getSessions,
  addSession,
  updateSession,
  getSetsForSession,
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
      console.error(err);
      res.status(500).send(err);
    }
  })
  .get('/:id/sets', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      let data = await getSetsForSession(id);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      res.status(500).send(err);
    }
  })
  .post('/:username', async (req: Request, res: Response) => {
    console.log('In sessions POST route for', req.params.username + '.');
    const { username } = req.params;
    const { session } = req.body;
    const { date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
      session;
    if (
      name === undefined ||
      phase_id === undefined ||
      mesocycle_id === undefined ||
      microcycle_id === undefined
    ) {
      res.status(400).send('Incomplete session object received.');
      return;
    }
    try {
      let data = await addSession(username, session);
      res.status(200).send(data);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
  .put('/', async (req: Request, res: Response) => {
    console.log('In sessions PUT route.');
    try {
      const { session } = req.body;
      const { id, date, name, phase_id, mesocycle_id, microcycle_id, user_id } =
        session;
      if (
        id === undefined ||
        date === undefined ||
        name === undefined ||
        phase_id === undefined ||
        mesocycle_id === undefined ||
        microcycle_id === undefined ||
        user_id === undefined
      ) {
        res.status(400).send('Incomplete session object received.');
        return;
      }
      await updateSession(session);
      const updatedSession = await findSession(id);
      res.status(200).send(updatedSession);
    } catch (err) {
      console.error(err);
      res.status(304).send(err);
    }
  });

module.exports = router;
