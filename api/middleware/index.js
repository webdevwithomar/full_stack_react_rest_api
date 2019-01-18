'use strict'
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models/users');

function requiresLogin(req, res, next) {
  const credentials = auth(req);
  if (credentials) {
    let user = User.findOne({ emailAddress: credentials.name });
    if (!user) {
      return res.status(400)
        .send(
          { message: 'Sorry no user was found with the given email.' });
    }
    // decrypting password in mongodb
    const result = bcrypt.compare(credentials.pass, user.password);
    if (!result) {
      return res.status(401).send({ message: 'Wrong email or password.' });
    }
    return next();

  } else {
    const err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

module.exports.requiresLogin = requiresLogin;