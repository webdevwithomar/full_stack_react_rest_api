import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Consumer } from './Context';

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