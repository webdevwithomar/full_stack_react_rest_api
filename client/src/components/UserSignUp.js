import React, { Component } from 'react';

class UserSignUp extends Component {
  render() {
    return (
      <div id="root">
        <div>
          <div className="header">
            <div className="bounds">
              <h1 className="header--logo">Courses</h1>
              <nav><a className="signup" href="sign-up.html">Sign Up</a><a className="signin" href="sign-in.html">Sign In</a></nav>
            </div>
          </div>
          <hr />
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign Up</h1>
              <div>
                <form>
                  <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value="" /></div>
                  <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value="" /></div>
                  <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value="" /></div>
                  <div><input id="password" name="password" type="password" className="" placeholder="Password" value="" /></div>
                  <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                    value="" /></div>
                  <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button className="button button-secondary" onclick="event.preventDefault(); location.href='index.html';">Cancel</button></div>
                </form>
              </div>
              <p>&nbsp;</p>
              <p>Already have a user account? <a href="sign-in.html">Click here</a> to sign in!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserSignUp;