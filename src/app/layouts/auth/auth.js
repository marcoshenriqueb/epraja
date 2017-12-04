import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './auth.styl';

import routeComponents from './../../router';
import Login from './../../pages/login/login';
import Table from './../../pages/table/table';

import api from './../../api';
import actions from './../../store/actions';
import Button from './../../components/button/button';

const { PrivateRoute, GuestRoute } = routeComponents;

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.token.length,
    };
  }

  componentDidMount() {
    if (!this.props.token.length) {
      console.log('No token');
      return;
    }

    api.auth({
      strategy: 'jwt',
      accessToken: this.props.token,
    }).then((response) => {
      console.log('Token checked');
      actions.receiveToken(response.accessToken, true);
      this.setState({
        loading: false,
      });
    }).catch(() => {
      console.log('Token invalid');
      actions.receiveToken('', false);
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) return <div>Loading</div>;

    const returnRoutes = () => [
      <PrivateRoute
        key={0}
        exact
        path="/"
        component={Table}
        isAuthenticated={this.props.authenticated}
      />,
      <PrivateRoute
        key={1}
        exact
        path="/caixa"
        component={Table}
        isAuthenticated={this.props.authenticated}
      />,
      <GuestRoute
        key={2}
        path="/login"
        component={Login}
        isAuthenticated={this.props.authenticated}
      />,
    ];

    return this.props.authenticated ?
      (
        <div className="full-w flex-column">
          <div className="full-w flex header">
            { this.props.user.email }
          </div>
          <div className="full-w flex navbar">
            <Button
              link="/"
              size="big"
              text="Pedidos"
            />
            <Button
              size="big"
              text="Cardápio"
            />
            <Button
              link="/caixa"
              size="big"
              text="Caixa"
            />
            <Button
              size="big"
              text="Relatórios de Satisfação"
            />
          </div>
          <div className="full-w">
            { returnRoutes() }
          </div>
        </div>
      ) :
      (
        <div className="full-w">
          { returnRoutes() }
        </div>
      );
  }
}

Auth.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  authenticated: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
};

const AuthConnector = connect(state => (
  {
    user: state.auth.user.data,
    authenticated: state.auth.authenticated,
    token: state.auth.token.data,
  }
))(Auth);

export default AuthConnector;
