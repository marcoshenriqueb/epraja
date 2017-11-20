import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './login.styl';

import actions from './../../store/actions';

const { login: loginAction } = actions;

const Login = ({ login }) => (
  <div className="full-w flex justify-center guest-wrapper">
    <div className="login-container flex-column">
      <h2>Login</h2>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={login}>Entrar</button>
    </div>
  </div>
);

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const LoginConnector = connect(state => (
  {
    auth: state.auth.authenticated,
  }
), dispatch => (
  {
    login: () => {
      dispatch(loginAction());
    },
  }
))(Login);

export default LoginConnector;
