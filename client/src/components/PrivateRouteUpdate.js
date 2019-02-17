import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Consumer } from './Context';

//If user is currently signed in, displays requested component (Update Course). If not, takes to forbidden page
const PrivateRouteUpdate = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => {
        return (
          <Route {...rest} render={props =>
            context.currentlySignedIn
              ? (<Component {...props} {...rest} />)
              : (<Redirect to={{ pathname: "/forbidden", state: { from: props.location } }} />)}
          />
        )
      }}
    </Consumer>
  );
}

export default PrivateRouteUpdate;