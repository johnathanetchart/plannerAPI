const express = require('express');
import { Request, Response } from 'express';
const {
  findPhase,
  getPhases,
  addPhase,
  updatePhase,
} = require('../../db/index.js');

const router = express.Router();
// router.use(express.json());

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
  .put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newName, newDate } = req.body;
    if (!(newName || newDate)) {
      res.status(400).send('No changes requested.');
      return;
    }
    console.log('updating phase with id', id);
    try {
      const data = await updatePhase(id, newName, newDate);
      //add findOne to return updated phase
      const updatedPhase = await findPhase(id);
      res.status(200).send(updatedPhase);
    } catch (err) {
      res.status(304).send(err);
    }
  });

// async (req : Request, res : Response) => {
//   try {
//     let data = await findUser(req.params.username);
//     res.status(200).send(data);
//   } catch(err) {
//     res.status(500).send(err);
//   }
// })

// .post()

module.exports = router;

/*
app.get('/users/:username', async (req : Request, res : Response) => {
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch(err) {
    res.status(500).send(err);
  }
});
*/
