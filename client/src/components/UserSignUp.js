import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

class UserSignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    validationError: false,
    validationMessage: "",
    firstNameMissing: "",
    lastNameMissing: "",
    emailMissing: "",
    emailFormatError: "",
    emailDuplicateError: "",
    passwordMissing: "",
    passwordMistmatch: ""
  }

  firstNameEntered = e => {
    this.setState({ firstName: e.target.value });
  }

  lastNameEntered = e => {
    this.setState({ lastName: e.target.value });
  }

  emailAddressEntered = e => {
    this.setState({ emailAddress: e.target.value });
  }

  passwordEntered = e => {
    this.setState({ password: e.target.value });
  }

  confirmPasswordEntered = e => {
    this.setState({ confirmPassword: e.target.value });
  }

  // Compares passwords
  checkPasswords = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ validationError: true, validationMessage: "Validation Error", passwordMismatch: "Passwords do not match" })
      return false;
    } else {
      return true;
    }
  }

  uponSubmit = e => {
    e.preventDefault();
    if (this.checkPasswords()) {
      this.signUp(this.state.firstName, this.state.lastName, this.state.emailAddress, this.state.password);
    }
  }

  signUp = (firstName, lastName, emailAddress, password) => {
    axios.post('http://localhost:5000/api/users', {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: password
    })
      .then(response => {
        this.props.signIn(this.state.emailAddress, this.state.password);
      })
      .then(response => {
        this.props.history.goBack();
      })
      .catch(error => {
        if (error.response.status === 400) {
          this.setState({ validationError: true, validationMessage: "Validation Error" });
          if (error.response.data.message === "Email must be correctly formatted (name@example.com)") {
            this.setState({ emailFormatError: "Email must be correctly formatted (name@example.com)" })
          }
          if (error.response.data.message === "First name is required") {
            this.setState({ firstNameMissing: "First name is required" })
          }
          if (error.response.data.message === "Last name is required") {
            this.setState({ lastNameMissing: "Last name is required" })
          }
          if (error.response.data.message === "Email address is required") {
            this.setState({ emailMissing: "Email address is required" })
          }
          if (error.response.data.message === "That email is already associated with another account") {
            this.setState({ emailDuplicateError: "That email is already associated with another account" })
          }
          if (error.response.data.message === "Password is required") {
            this.setState({ passwordMissing: "Password is required" })
          }
        } else
          if (error.response.status === 500) {
            this.props.history.push('/error');
          }
      })
  }

  render() {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            <div>
              <h2 className="validation--errors--label">{this.state.validationMessage}</h2>
              <div className="validation-errors">
                <ul>
                  <li>{this.state.firstNameMissing}</li>
                  <li>{this.state.lastNameMissing}</li>
                  <li>{this.state.emailMissing}</li>
                  <li>{this.state.emailFormatError}</li>
                  <li>{this.state.emailDuplicateError}</li>
                  <li>{this.state.passwordMissing}</li>
                  <li>{this.state.passwordMismatch}</li>
                </ul>
              </div>
            </div>
            <form onSubmit={this.uponSubmit}>
              <div><input onChange={this.firstNameEntered} id="firstName" name="firstName" type="text" className="" placeholder="First Name" /></div>
              <div><input onChange={this.lastNameEntered} id="lastName" name="lastName" type="text" className="" placeholder="Last Name" /></div>
              <div><input onChange={this.emailAddressEntered} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" /></div>
              <div><input onChange={this.passwordEntered} id="password" name="password" type="password" className="" placeholder="Password" /></div>
              <div><input onChange={this.confirmPasswordEntered} id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" /></div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign Up</button>
                <Link to={"/"}><button className="button button-secondary">Cancel</button></Link>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
        </div>
      </div>
    )
  }
}

export default withRouter(UserSignUp);