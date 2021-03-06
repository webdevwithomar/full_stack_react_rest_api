'use strict';

// load modules
const express = require('express');
const cors = require("cors");
const logger = require('morgan');
const jsonParser = require("body-parser").json;
const mongoose = require("mongoose");
const routes = require("./routes/rootRoute");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// init app
const app = express();

// CORS
app.use(cors());

// morgan
app.use(logger('dev'));

// jsonParser
app.use(jsonParser());

// mongoose
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => {
  console.error("Connection error:", error);
});
db.once("open", () => {
  console.log("Database connection successful");
});

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (request.method === "OPTIONS") {
    response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    return response.status(200).json({});
  }
  next();
});

// routes
app.get("/", (request, response) => {
  response.redirect("/api")
});
app.use("/api", routes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// error handlers
app.use((request, response) => {
  response.status(404).json({
    message: '404: Not Found',
  });
});

app.use((error, request, response, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(error.stack)}`);
  }
  response.status(error.status || 500).json({
    message: error.message,
    error: {},
  });
});

// port
app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled rejection:', err);
});