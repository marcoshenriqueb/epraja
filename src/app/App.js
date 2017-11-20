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
const { fetchUserAction } = actions;

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = ({ auth, fetchUser }) => {
  if (false) {
    fetchUser();
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
  auth: PropTypes.bool.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

const AppConnector = connect(state => (
  {
    auth: state.auth.authenticated,
  }
), dispatch => (
  {
    fetchUser: () => {
      dispatch(fetchUserAction());
    },
  }
))(App);

export default AppConnector;
