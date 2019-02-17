'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String
});

//Middleware to check that email isn't already linked to another user  https://stackoverflow.com/questions/13582862/mongoose-pre-save-async-middleware-not-working-as-expected
UserSchema.pre("save", function(next) {
  const self = this;
  User.findOne({emailAddress : this.emailAddress}, 'emailAddress', function(error, response) {
    if(response) {
      const error = new Error("That email is already associated with another account");
      error.status = 400;
      return next(error);
    } else {
      next();
    }
  });
});

const User = mongoose.model("User", UserSchema);
module.exports.User = User;
