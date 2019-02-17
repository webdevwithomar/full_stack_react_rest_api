'use strict';

const express = require("express");
const router = express.Router();
const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const Course = require("../models/Course").Course;
const User = require("../models/User").User;


router.param("id", (request, response, next, id) => {
  Course.findById(id, (error, doc) => {
      if(error) return next(error);
      if(!doc){
        const error = new Error("Not Found");
        error.status = 404;
        return next(error);
      }
      request.course = doc;
      return next();
  });
});


//READ/GET /api/courses 200 --Returns a list of courses (including the user that owns each course)
router.get('/', (request, response, next) => {
  Course.find({})
    .populate("user", "firstName lastName")
    .exec((error, courses) => {
        if(error) return next(error);
        response.status(200);
        response.json(courses);
  });
});


//READ/GET /api/courses/:id 200 --Returns a course (including the user that owns the course) for the provided course ID
router.get('/:id', (request, response, next) => {
  Course.findById(request.params.id)
     .populate("user", "firstName lastName")
     .exec((error, course) => {
         if(error) return next(error);
         response.status(200);
         response.json(course);
     });
});


//Middleware function that attempts to get the user credentials from the Authorization header set on the request
router.use((request, response, next) => {
  //If object with name and password is returned
  if(auth(request)){
      //Use user's email address to attempt to retrieve user from database
      User.findOne({emailAddress: auth(request).name}).exec((error, user) => {
          //If user is found matching email address
          if(user) {
              //Check password against stored hash
              bcrypt.compare(auth(request).pass, user.password, (error, response) => {
                  if(response || auth(request).pass === user.password) {
                    //Set user on request so middleware functions have access to it
                    request.user = user;
                    next();
                  } else {
                    //If password doesn't match, return 401
                    const error = new Error("Unauthorized user-- your request could not be authenticated");
                    error.status = 401;
                    return next(error);
                  }
              });
          } else {
            const error = new Error("You must be logged in to perform that action");
            error.status = 401;
            return next(error);
          }
      });
   }
});

//CREATE/POST /api/courses 201 --Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', (request, response, next) => {
    if(request.user) {
        if(request.body.title && request.body.description) {
            const newCourse = {
                                user: request.user,
                                title: request.body.title,
                                description: request.body.description,
                                estimatedTime: request.body.estimatedTime,
                                materialsNeeded: request.body.materialsNeeded
                              }
            Course.create(newCourse, (error) => {
              if(error) return next(error);
              response.location('/');
              response.sendStatus(201);
            });
        }
        if (!request.body.title) {
          const error = new Error("Please enter a title");
          error.status = 400;
          return next(error);
        }
        if (!request.body.description) {
          const error = new Error("Please enter a description");
          error.status = 400;
          return next(error);
        }
    }
});


//UPDATE/PUT /api/courses/:id 204 --Updates a course and returns no content. https://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
router.put('/:id', (request, response, next) => {
    if(request.user){
        if(request.course.user.toString() === request.user._id.toString()) {
            if(request.body.title && request.body.description) {
                Course.findOneAndUpdate(
                            {"_id": request.params.id},
                            {"$set": {
                              "title": request.body.title,
                              "description": request.body.description,
                              "estimatedTime": request.body.estimatedTime,
                              "materialsNeeded": request.body.materialsNeeded
                            }},
                        ).exec((error, course) => {
                          if(error) return next(error);
                          response.sendStatus(204);
                        });
            }
            if (!request.body.title) {
              const error = new Error("Please enter a title");
              error.status = 400;
              return next(error);
            }
            if (!request.body.description) {
              const error = new Error("Please enter a description");
              error.status = 400;
              return next(error);
            }
        } else {
          const error = new Error("Unauthorized-- you are not the owner of this course");
          error.status = 403;
          return next(error);
        }
    } else {
      const error = new Error("Unauthorized-- you are not the owner of this course");
      error.status = 403;
      return next(error);
    }
});

//DELETE /api/courses/:id 204 --Deletes a course and returns no content
router.delete('/:id', (request, response, next) => {
    if(request.user){
        if(request.course.user.toString() === request.user._id.toString()) {
          request.course.remove();
          response.sendStatus(204);
        } else {
          const error = new Error("Unauthorized-- you are not the owner of this course");
          error.status = 403;
          return next(error);
        }
    }
});

module.exports = router;
