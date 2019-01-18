'use strict';

const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  estimatedTime: String,
  materialsNeeded: String,
});

const Course = mongoose.model('course', CourseSchema);

// validations
function validateCourse(course) {
  const schema = {
    user: Joi.objectId().required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(1).required(),
    estimatedTime: Joi.string(),
    materialsNeeded: Joi.string(),
  };
  return Joi.validate(course, schema);
}

module.exports = { Course, validateCourse };