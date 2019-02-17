// imports
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import UpdateCourse from './components/UpdateCourse';
import Header from './components/Header';
import Forbidden from './components/Forbidden';
import Error from './components/Error';
import NotFound from './components/NotFound';
import './App.css';

class App extends Component {

  state = {
    user: ''
  }

  // authentication
  signIn = (email, pass, history) => {
    axios.get('http://localhost:5000/api/users', {
      auth: { username: email, password: pass }
    })
      .then(res => {
        if (res.status === 200) {
          localStorage.setItem('idUserLogin', res.data._id);
          localStorage.setItem('firstName', res.data.firstName);
          localStorage.setItem('lastName', res.data.lastName);
          localStorage.setItem('password', res.data.password);
          localStorage.setItem('emailAddress', res.data.emailAddress);

          const firstName = localStorage.getItem('firstName');
          const lastName = localStorage.getItem('lastName');
          const password = localStorage.getItem('password');
          const emailAddress = localStorage.getItem('emailAddress');
          const idUserLogin = localStorage.getItem('idUserLogin');
          this.setState({
            user: { firstName, lastName, password, emailAddress, idUserLogin }
          });
          history.goBack();
        }
      })
      .catch(err => console.log(err));
  }

  render() {

    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const password = localStorage.getItem('password');
    const emailAddress = localStorage.getItem('emailAddress');
    const idUserLogin = localStorage.getItem('idUserLogin');
    const user = { firstName, lastName, password, emailAddress, idUserLogin }
    const loggedIn = emailAddress;

    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" render={props => <Header user={user} />} />
          <Switch>
            <Route exact path="/" render={props => <Courses user={user} />} />
            <Route exact path="/courses/create" render={props => <CreateCourse user={user} />} />
            <Route path="/courses/:id/update" render={props => <UpdateCourse />} />
            <Route exact path="/courses/:id" render={props => <CourseDetail id={props.match.params.id} user={user} />} />
            <Route path="/signin" render={props => <UserSignIn signIn={this.signIn} history={props.path} />} />
            <Route path="/signup" render={() => loggedIn ? (<Redirect to="/" />) : (<UserSignUp />)} />
            <Route path="/signout" render={props => <UserSignOut />} />
            <Route path="/forbidden" render={props => <Forbidden />} />
            <Route path="/error" render={props => <Error />} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;