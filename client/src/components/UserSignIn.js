// imports
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';

class UserSignIn extends Component {

  static propTypes = {
    user: PropTypes.object,
    signIn: PropTypes.func
  };

  state = {
    emailAddress: '',
    password: ''
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.signIn(this.state.emailAddress, this.state.password, this.props.history);
  }

  render() {
    return (
      <div id="root">
        <div>
          <hr />
          <div className="bounds">
            <div className="grid-33 centered signin">
              <h1>Sign In</h1>
              <div>
                <form onSubmit={this.onSubmit}>
                  <div><input onChange={this.onChange} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" /></div>
                  <div><input onChange={this.onChange} id="password" name="password" type="password" className="" placeholder="Password" /></div>
                  <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button onClick={() => this.props.history.push("/")} className="button button-secondary">Cancel</button></div>
                </form>
              </div>
              <p>&nbsp;</p>
              <p>Don't have a user account? <Link to="/signup">Click Here</Link> to sign up!</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(UserSignIn);