// imports
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

// signed out users
class SignOut extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  eventSignOut = () => {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    const firstName = this.props.user.firstName;
    const lastName = this.props.user.lastName;
    return (
      <div>
        <Link to="#">Welcome {firstName + " " + lastName}</Link>
        <Link to="#" onClick={this.eventSignOut}>Log Out</Link>
      </div>
    );
  }
}

// signed in users
const SignIn = () => {
  return (
    <div>
      <Link className="signup" to="/signup">Sign Up</Link>
      <Link className="signin" to="/signin">Sign In</Link>
    </div>
  );
}

class Header extends Component {
  render() {
    const isSignIn = this.props.user.emailAddress;
    const user = this.props.user;
    return (
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">
            <Link to="/">Courses</Link>
          </h1>
          <nav>
            {isSignIn ? <SignOut isSignIn={isSignIn} user={user} /> : <SignIn />}
          </nav>
        </div>
      </div>
    );
  }
}

export default Header;