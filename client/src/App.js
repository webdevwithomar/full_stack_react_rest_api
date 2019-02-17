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
import PrivateRouteCreate from './components/PrivateRouteCreate';
import PrivateRouteUpdate from './components/PrivateRouteUpdate';
import { Provider } from './components/Context';
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
      .then(res => {
        if (res.status === 200 || res.status === 304) {
          this.setState({
            user: res.data,
            currentlySignedIn: true,
            validationError: false,
            validationMessage: ""
          });

          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("auth", JSON.stringify(res.config.headers.Authorization));
        }
      })
      .catch(error => {
        if (error.res.status === 400) {
          this.setState({ currentlySignedIn: false, validationError: true, validationMessage: "Validation Error" })
          if (error.res.data.message === "Email must be correctly formatted (name@example.com)") {
            this.setState({ emailFormatError: "Email must be correctly formatted (name@example.com)" })
          }
          if (error.res.data.message === "Email address is required") {
            this.setState({ emailMissing: "Email address is required" })
          }
          if (error.res.data.message === "Password is required") {
            this.setState({ passwordMissing: "Password is required" })
          }
        } else if (error.res.status === 401) {
          this.setState({ validationError: true, validationMessage: "Error", loginError: error.res.data.message });
        } else if (error.res.status === 500) {
          this.state.history.push('/error');
        }
      });
  }


  signOut = () => {
    // Removing the email and pass from the global state
    this.setState({
      user: "",
      currentlySignedIn: false,
      validationError: false
    });
    localStorage.clear();
  }


  componentDidMount() {
    // Be logged in
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