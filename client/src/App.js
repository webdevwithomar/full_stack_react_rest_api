import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import UpdateCourse from './components/UpdateCourse';
import Header from './components/Header'
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" render={props => <Header />} />
          <Switch>
            <Route exact path="/" render={props => <Courses />} />
            <Route exact path="/courses/create" render={props => <CreateCourse />} />
            <Route path="/courses/:id/update" render={props => <UpdateCourse />} />
            <Route exact path="/courses/:id" render={props => <CourseDetail />} />
            <Route path="/signin" render={props => <UserSignIn />} />
            <Route path="/signup" render={props => <UserSignUp />} />
            <Route path="/signout" render={props => <UserSignOut />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
