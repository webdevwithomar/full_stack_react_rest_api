import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Consumer } from "./Context";

// If someone is signed in, they get a welcome message along with their name. If not, the sign in / up buttons get rendered
const Header = props => {
  return (
    <div className="header">
      <div className="bounds">
        <Link className="header--logo" to={"/"}>Courses</Link>
        {
          props.currentlySignedIn ?
            <Consumer>
              {context => {
                return (
                  <nav><span>Welcome, {context.user.firstName} {context.user.lastName}!</span><NavLink className="signout" to={"/signout"}>Sign Out</NavLink></nav>
                );
              }}
            </Consumer>
            :
            <div>
              <nav><NavLink className="signup" to={"/signup"}>Sign Up</NavLink><NavLink className="signin" to={"/signin"}>Sign In</NavLink></nav>
            </div>
        }
      </div>
    </div>
  )

};

export default Header;