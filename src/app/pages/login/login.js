import React from 'react';
import './login.styl';

const Login = () => (
  <div className="full-w flex justify-center guest-wrapper">
    <div className="login-container flex-column">
      <h2>Login</h2>
      <input type="text" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Entrar</button>
    </div>
  </div>
);

export default Login;
