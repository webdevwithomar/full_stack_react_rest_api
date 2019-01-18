// imports
import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';

class UserSignUp extends Component {

  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    error: '',
    pass: ''
  }

  // validation
  validation = () => {
    if (this.state.firstName &&
      this.state.lastName &&
      this.state.emailAddress &&
      this.state.password === this.state.confirmPassword) {
      return true
    } else {
      return false
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  //signUp user, send POST request
  onSubmit = (e) => {
    const { firstName,
      lastName,
      emailAddress,
      password
    } = this.state;
    const newUser = {
      firstName,
      lastName,
      emailAddress,
      password
    }
    e.preventDefault();
    if (this.validation()) {
      axios.post("http://localhost:5000/api/users", newUser)
        .then(response => {
          if (response.status === 201) {
            this.props.history.push("/signin");
          }
        })
        .catch(error => {
          if (error) {
            this.setState({
              pass: true
            });
            console.log("Error changing password")
          }
        });
    } else {
      console.log('Please fill all the required fields')
    }
  }

  //check validation on each field
  checkIfValid = val => {
    let checkIfValid;
    if (val) {
      checkIfValid = '';
    } else {
      checkIfValid = "Please fill in the box"
    }
    return checkIfValid;
  }

  //check matched passwords
  checkValidPass = (pass, confirm) => {
    let checkValid;
    if (pass !== confirm) {
      checkValid = "Passwords must match";
    } else {
      checkValid = ""
    }
    return checkValid
  }

  //check password
  checkPass = (pass) => {
    if (pass) {
      let error = "Something went wrong";
      return error;
    }
  }

  render() {
    return (
      <div id="root">
        <div>
          <hr />
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign Up</h1>
              <div>
                <form onSubmit={this.onSubmit}>
                  <div><input onChange={this.onChange} id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} />
                    <div className="checkIfValid">{this.checkIfValid(this.state.firstName)}</div>
                  </div>
                  <div><input onChange={this.onChange} id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} />
                    <div className="checkIfValid">{this.checkIfValid(this.state.lastName)}</div>
                  </div>
                  <div><input onChange={this.onChange} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} />
                    <div className="checkIfValid">{this.checkIfValid(this.state.emailAddress)}</div>
                  </div>
                  <div><input onChange={this.onChange} id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} />
                    <div className="checkIfValid">{this.checkPass(this.state.pass)}</div>
                  </div>
                  <div><input onChange={this.onChange} id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                    value={this.state.confirmPassword} />
                    <div className="checkIfValid">{this.checkIfValid(this.state.password)}</div>
                  </div>
                  <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button onClick={() => this.props.history.push("/")} className="button button-secondary" >Cancel</button></div>
                </form>
              </div>
              <p>&nbsp;</p>
              <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(UserSignUp);