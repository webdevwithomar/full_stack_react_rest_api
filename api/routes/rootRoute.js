'use strict';

const express = require("express");
const router = express.Router();
router.get('/', (request, response) => {
  response.json({ message: 'Welcome to the course catalog!' });
});

module.exports = router;