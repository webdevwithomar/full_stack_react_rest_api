"use strict";
const { Course, validateCourse } = require('../models/course');
const { User, validateUser } = require('../models/users');
const express = require('express');
const router = express.Router();
var auth = require('basic-auth');
const middle = require('../middleware');

router.param("cID", function (req, res, next, id) {
  Course.findById(id, function (err, course) {
    if (err) return next(err);
    if (!course) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.course = course;
    return next();
  });
});

router.get('/', (req, res) => {
  res.json({
    message: 'Hello and welcome to my REST API project!',
  });
});

// GET /courses
// route for courses collection
router.get('/api/courses', (req, res, next) => {
  Course.find({})
    .exec((err, listCourses) => {
      if (err) return next(err);
      res.json(listCourses);
    });
});

// GET /course--Route for course
// use .populate() to achieve the extra credit part 3
router.get('/api/courses/:id', (req, res, next) => {
  const courseId = req.params.id;
  Course.findById(courseId).
    populate('user', 'firstName lastName').
    exec(function (err, course) {
      if (err) return next(err);
      res.status(200).send(course);
    });
});

// POST /courses
// route for courses collection

router.post('/api/courses', middle.requiresLogin, function (req, res, next) {
  const courseProps = req.body;
  const { error } = validateCourse(courseProps);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const course = new Course(req.body);
  course.save(function (err, course) {
    if (err) return next(err);
    res.location(`/api/courses/${course._id}`);
    return res.sendStatus(201);
  });
});

// PUT /courses
// route for courses collection
router.put('/api/courses/:cID', middle.requiresLogin, function (req, res) {
  const credential = auth(req);
  const courseProps = req.body;
  User.findById(courseProps.user)
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400)
          .send({ message: 'There is no such user with given userId.' });
      }
      if (user.emailAddress !== credential.name) {
        return res.status(403)
          .send({ message: 'You do not own the requested course.' });
      }
      req.course.update(req.body, function (err, course) {
        if (err) return next(err);
        return res.sendStatus(204);
      })
    });
});

// DELETE /courses
// route for courses collection
router.delete("/api/courses/:cID", middle.requiresLogin, function (req, res) {
  const credential = auth(req);
  const courseProps = req.body;
  User.findById(courseProps.user)
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400)
          .send({ message: 'There is no such user with given userId.' });
      }
      if (user.emailAddress !== credential.name) {
        return res.status(403)
          .send({ message: 'You do not own the requested course.' });
      }
      req.course.remove(function (err) {
        req.course.save(function (err, course) {
          if (err) return next(err);
          return res.sendStatus(204);
        });
      });
    });
});

// GET /users
// route for users collection
router.get('/api/users', middle.requiresLogin, (req, res, next) => {
  const credential = auth(req);
  const courseProps = req.body;
  User.findOne({ emailAddress: credential.name })
    .exec((err, user) => {
      if (err) return next(err);
      res.json(user);
    });
});

// POST /users
// route for users collection

router.post('/api/users', function (req, res, next) {
  const userProps = req.body;
  User.findOne({ emailAddress: userProps.emailAddress })
    .exec((err, user) => {
      if (err) return next(err);
      if (user) {
        return res.status(400).send(
          { message: 'There is already an account associated with this email.' });
      }
      else {
        const user = new User(req.body);
        user.save((err, user) => {
          if (err) return next(err);
          res.location('/');
          res.sendStatus(201);
        });
      };
    });
});

module.exports = router;