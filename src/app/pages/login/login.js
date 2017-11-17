import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './login.styl';

const Login = ({ auth }) => (
  <div className="full-w flex justify-center guest-wrapper">
    <div className="login-container flex-column">
      <h2>Login</h2>
      <p>{ auth }</p>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Entrar</button>
    </div>
  </div>
);

Login.propTypes = {
  auth: PropTypes.bool.isRequired,
};

const LoginConnector = connect(state => (
  {
    auth: state.auth.authenticated,
  }
))(Login);

export default LoginConnector;
