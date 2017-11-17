import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import routeComponents from './router';
import Login from './pages/login/login';

const { PrivateRoute, GuestRoute } = routeComponents;

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = ({ token, auth }) => {
  if (token.length) {
    expression
  }

  return (
    <Router>
      <div>
        <GuestRoute path="/login" component={Login} isAuthenticated={auth} />
        <PrivateRoute path="/about" component={About} isAuthenticated={auth} />
      </div>
    </Router>
  );
};
/* eslint-enable jsx-a11y/anchor-is-valid */

App.propTypes = {
  token: PropTypes.string.isRequired,
  auth: PropTypes.bool.isRequired,
};

const AppConnector = connect(state => (
  {
    token: state.auth.token,
    auth: state.auth.authenticated,
  }
))(App);

export default AppConnector;
