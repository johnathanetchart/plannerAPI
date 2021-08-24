const express = require('express');

const router = express.router();
// router.use(express.json());

router.route('/users')
  .get()
  .post()

module.exports = router;