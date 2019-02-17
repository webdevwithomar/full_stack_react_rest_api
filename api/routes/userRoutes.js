'use strict';

const express = require("express");
const router = express.Router();
const auth = require("basic-auth");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require("../models/User").User;


// POST /api/users
router.post('/', (request, response, next) => {
  if (request.body.firstName && request.body.lastName && request.body.emailAddress && request.body.password) {
    if (/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(request.body.emailAddress)) {
      const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        emailAddress: request.body.emailAddress,
        password: bcrypt.hashSync(request.body.password, saltRounds)
      }
      User.create(newUser, (error) => {
        if (error) return next(error);
        response.location('/');
        response.sendStatus(201);
      });
    } else if (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(request.body.emailAddress)) {
      const error = new Error("Email must be correctly formatted (name@example.com)");
      error.status = 400;
      return next(error);
    }
  } else {
    if (!request.body.firstName) {
      const error = new Error("First name is required");
      error.status = 400;
      return next(error);
    }
    if (!request.body.lastName) {
      const error = new Error("Last name is required");
      error.status = 400;
      return next(error);
    }
    if (!request.body.emailAddress) {
      const error = new Error("Email address is required");
      error.status = 400;
      return next(error);
    }
    if (!request.body.password) {
      const error = new Error("Password is required");
      error.status = 400;
      return next(error);
    }
  }
});

router.use((request, response, next) => {
  if (auth(request)) {
    User.findOne({ emailAddress: auth(request).name }).exec((error, user) => {
      if (user) {
        bcrypt.compare(auth(request).pass, user.password, (error, response) => {
          if (response || auth(request).pass === user.password) {
            request.user = user;
            next();
          } else {
            const error = new Error("The email or password you entered were incorrect");
            error.status = 401;
            return next(error);
          }
        });
      } else {
        const error = new Error("The email or password you entered were incorrect");
        error.status = 401;
        return next(error);
      }
    });
  }
});

// GET /api/users
router.get('/', (request, response, next) => {
  if (request.user) {
    User.find({})
      .exec((error, user) => {
        if (error) return next(error);
        response.json(request.user);
      });
  }
});

module.exports = router;