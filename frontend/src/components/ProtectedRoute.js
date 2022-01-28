import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...props }) => {
  //Это значит, что данные могут поступать от родителя к HOC-компоненту.
  return <Route>{() => (props.loggedIn ? <Component {...props} /> : <Redirect to="/sign-in" />)}</Route>;
};

export default ProtectedRoute;
