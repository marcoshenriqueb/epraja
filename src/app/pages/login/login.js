import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './login.styl';

import TextInput from './../../components/textInput/textInput';
import Button from './../../components/button/button';
import actions from './../../store/actions';

const { login: loginAction } = actions;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="full-w flex justify-center guest-wrapper">
        <div className="login-container flex-column">
          <h2>Tapster</h2>
          <TextInput
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <TextInput
            type="password"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <Button
            text="Entrar"
            onClick={this.props.login}
          />
          {
            this.state.error.length ?
            (
              <p>Invalid credentials.</p>
            ) : null
          }
        </div>
      </div>
    );
  }
}

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
