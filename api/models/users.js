'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('joi');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  emailAddress: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Email adress is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
});

UserSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, saltRounds).then(function (hash) {
    user.password = hash;
    next();
  }).catch(err => {
    console.error(err)
  });
});

const User = mongoose.model('users', UserSchema);

// validations
function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    emailAddress: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

module.exports = { User, validateUser };