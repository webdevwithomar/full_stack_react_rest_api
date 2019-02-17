'use strict';

const express = require("express");
const router = express.Router();

//GET --set up a friendly greeting for the root route
router.get('/', (request, response) => {
  response.json({message: 'Welcome to the course catalog!'});
});

module.exports = router;
