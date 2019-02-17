import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Consumer } from './Context';

//If user is currently signed in, displays requested component (Create Course). If not, takes to sign in page. Used project resource link and https://auth0.com/blog/react-router-4-practical-tutorial/
const PrivateRouteCreate = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => {
        return (
          <Route {...rest} render={props =>
            context.currentlySignedIn
              ? (<Component {...props} {...rest} />)
              : (<Redirect to={{ pathname: "/signin", state: { from: props.location } }} />)}
          />
        )
      }}
    </Consumer>
  );
}

export default PrivateRouteCreate;