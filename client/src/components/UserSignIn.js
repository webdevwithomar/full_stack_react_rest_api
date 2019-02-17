import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Consumer } from './Context'

class UserSignIn extends Component {
  state = {
    emailAddress: "",
    password: "",
    currentlySignedIn: false,
    validationMessage: "",
    loginError: ""
  }

  emailEntered = e => {
    this.setState({ emailAddress: e.target.value });
  }

  passwordEntered = e => {
    this.setState({ password: e.target.value });
  }

  uponSubmit = e => {
    e.preventDefault();
    this.props.signIn(this.state.emailAddress, this.state.password)
  }

  render() {
    return (
      <Consumer>
        {context => {
          if (context.currentlySignedIn) {
            this.props.history.goBack();
          }
          return (
            <div className="bounds">
              <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                <div>
                  <div>
                    <h2 className="validation--errors--label">{this.props.validationMessage}</h2>
                    <div className="validation-errors">
                      <ul><li>{this.props.loginError}</li></ul>
                    </div>
                  </div>
                  <form onSubmit={this.uponSubmit}>
                    <div><input onChange={this.emailEntered} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" /></div>
                    <div><input onChange={this.passwordEntered} id="password" name="password" type="password" className="" placeholder="Password" /></div>
                    <div className="grid-100 pad-bottom">
                      <button className="button" type="submit">Sign In</button>
                      <Link to={"/"}><button className="button button-secondary">Cancel</button></Link>
                    </div>
                  </form>
                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <Link to={"/signup"}>Click here</Link> to sign up!</p>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}

export default withRouter(UserSignIn);