import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import routeComponents from './router';
import Login from './pages/login/login';
import actions from './store/actions';

const { PrivateRoute, GuestRoute } = routeComponents;
const { checkToken: checkTokenAction } = actions;

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = ({ token, auth, checkToken }) => {
  if (token.length && !auth) {
    checkToken(token);
    return <p>Loading</p>;
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
  checkToken: PropTypes.func.isRequired,
};

const AppConnector = connect(state => (
  {
    token: state.auth.token,
    auth: state.auth.authenticated,
  }
), dispatch => (
  {
    checkToken: (token) => {
      dispatch(checkTokenAction(token));
    },
  }
))(App);

export default AppConnector;
