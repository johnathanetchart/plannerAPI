const express = require('express');
import { Request, Response } from 'express';
const { findUser, getSessions } = require('../../db/index.js');

const router = express.Router();
// router.use(express.json());

router.get('/:username', async (req: Request, res: Response) => {
  console.log('in username route');
  try {
    let data = await findUser(req.params.username);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
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
