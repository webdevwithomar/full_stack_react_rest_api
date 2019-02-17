'use strict';

const express = require("express");
const router = express.Router();
const auth = require("basic-auth");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require("../models/User").User;


//CREATE/POST /api/users 201 --Creates a user, sets the Location header to "/", and returns no content
router.post('/', (request, response, next) => {
  if(request.body.firstName && request.body.lastName && request.body.emailAddress && request.body.password) {
      //Regex for email check copied from my project #3
      if(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(request.body.emailAddress)){
            const newUser = {
                     firstName: request.body.firstName,
                     lastName: request.body.lastName,
                     emailAddress: request.body.emailAddress,
                     password: bcrypt.hashSync(request.body.password, saltRounds)
                   }
            User.create(newUser, (error) => {
               if(error) return next(error);
               response.location('/');
               response.sendStatus(201);
            });
      } else if (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(request.body.emailAddress)){
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


//Middleware function that attempts to get the user credentials from the Authorization header set on the request
router.use((request, response, next) => {
  if(auth(request)){
      User.findOne({emailAddress: auth(request).name}).exec((error, user) => {
          if(user) {
              bcrypt.compare(auth(request).pass, user.password, (error, response) => {
                  if(response || auth(request).pass === user.password){
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

//READ/GET /api/users 200 --Returns the currently authenticated user
router.get('/', (request, response, next) => {
    if(request.user) {
      User.find({})
        .exec((error, user) => {
          if(error) return next(error);
          response.json(request.user);
        });
    }
});


module.exports = router;











// //To view specific users or delete users
// router.param("id", (request, response, next, id) => {
//   User.findById(id, (error, doc) => {
//       if(error) return next(error);
//       if(!doc){
//         const error = new Error("Not Found");
//         error.status = 404;
//         return next(error);
//       }
//       request.user = doc;
//       return next();
//   });
// });
//
// //To view all users
// router.get('/', (request, response, next) => {
//   if(request.user) {
//     User.find({})
//       .exec((error, user) => {
//         if(error) return next(error);
//         response.status(200);
//         response.json(user);
//       });
//    } else {
//      const error = new Error("Please log in");
//      error.status = 400;
//      return next(error);
//    }
// });
//
// //To delete users
// router.delete('/:id', (request, response, next) => {
//   // if(authentication passes) {
//     request.user.remove();
//     response.status(204);
//   // } else {
//   //   const error = new Error("You are not authorized to delete this course");
//   //   error.status = 403;
//   //   return next(error);
//   // }
// });
