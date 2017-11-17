import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import routeComponents from './router';
import Login from './pages/login/login';

const { PrivateRoute } = routeComponents;

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = connect((state) => {
  console.log(state);
  return {
    token: state.auth.token,
    auth: state.auth.authenticated,
  };
})(({ token, auth }) => {
  console.log(!token.length);

  return (
    <Router>
      <div>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/about" component={About} isAuthenticated={auth} />
      </div>
    </Router>
  );
});
/* eslint-enable jsx-a11y/anchor-is-valid */

App.propTypes = {
  token: PropTypes.string.isRequired,
  auth: PropTypes.bool.isRequired,
};

export default App;
