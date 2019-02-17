// All the imports
import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import axios from "axios";
// All Components
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import PrivateRouteCreate from './components/PrivateRouteCreate';
import PrivateRouteUpdate from './components/PrivateRouteUpdate';
import { Provider } from './components/Context';
// Error
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import Error from './components/Error';
// CSS
import './App.css';

class App extends Component {
  state = {
    user: "",
    emailAddress: "",
    password: "",
    courses: [],
    currentlySignedIn: false,
    validationError: false,
    validationMessage: "",
    emailFormatError: "",
    emailMissing: "",
    passwordMissing: "",
    loginError: "",
    redirectToPreviousRoute: false
  }

  signIn = (emailAddress, password) => {
    axios.get('http://localhost:5000/api/users', {
      auth: { username: emailAddress, password: password }
    })
      .then(response => {
        if (response.status === 200 || response.status === 304) {
          this.setState({
            user: response.data,
            currentlySignedIn: true,
            validationError: false,
            validationMessage: ""
          });
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("auth", JSON.stringify(response.config.headers.Authorization));
        }
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.setState({ currentlySignedIn: false, validationError: true, validationMessage: "Validation Error" })
          if (error.response.data.message === "The email is not formatted correctly.") {
            this.setState({ emailFormatError: "The email is not formatted correctly." })
          }
          if (error.response.data.message === "Email address is required") {
            this.setState({ emailMissing: "Email address is required" })
          }
          if (error.response.data.message === "Password is required") {
            this.setState({ passwordMissing: "Password is required" })
          }
        } else if (error.response.status === 401) {
          this.setState({ validationError: true, validationMessage: "Error", loginError: error.response.data.message });
        } else if (error.response.status === 500) {
          this.state.history.push('/error');
        }
      });
  }

  signOut = () => {
    this.setState({
      user: "",
      currentlySignedIn: false,
      validationError: false
    });
    localStorage.clear();
  }

  // If not signed out, keep the user signed in
  componentDidMount() {
    if (localStorage.user) {
      let user = JSON.parse(window.localStorage.getItem('user'));
      this.signIn(user.emailAddress, user.password)
    }
  }

  render() {
    return (
      <Provider
        value={{
          user: this.state.user,
          currentlySignedIn: this.state.currentlySignedIn,
          validationError: this.state.userValidationError,
          validationMessage: this.state.validationMessage,
          loginError: this.state.loginError,
          actions: { signIn: this.signIn, signOut: this.signOut }
        }}
      >
        <BrowserRouter>
          <div>
            <Header currentlySignedIn={this.state.currentlySignedIn} signOut={this.signOut} />
            <Switch>
              <Route exact path='/' render={() => <Redirect to='/courses' />} />
              <Route exact path='/courses' component={Courses} />
              <PrivateRouteCreate exact path='/courses/create' component={CreateCourse} user={this.state.user} />
              <PrivateRouteUpdate exact path='/courses/:id/update' component={UpdateCourse} user={this.state.user} />
              <Route exact path='/courses/:id' component={CourseDetail} user={this.state.user} />
              <Route exact path='/signin' render={() => <UserSignIn signIn={this.signIn} validationError={this.state.validationError} validationMessage={this.state.validationMessage} emailFormatError={this.state.emailFormatError} emailMissing={this.state.emailMissing} passwordMissing={this.state.passwordMissing} loginError={this.state.loginError} />} />
              <Route exact path='/signup' render={() => <UserSignUp signIn={this.signIn} />} />
              <Route exact path='/signout' render={() => <UserSignOut signOut={this.signOut} />} />
              <Route exact path='/notfound' component={NotFound} />
              <Route exact path='/forbidden' component={Forbidden} />
              <Route exact path='/error' component={Error} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;