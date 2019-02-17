'use strict';

const express = require('express');
const logger = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const app = express();
app.use(bodyParser.json());
app.use(logger('dev'));

// CORS
app.use(cors());

// mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fsjstd-restapi', {
  useCreateIndex: true,
  useNewUrlParser: true
});

const db = mongoose.connection;

db.on("error", function (err) {
  console.error("connection error:", err);
});

db.once("open", function () {
  console.log("db connection successful");
});

// TODO set up API routes
app.use(routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});