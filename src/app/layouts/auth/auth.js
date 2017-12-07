import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './auth.styl';

import routeComponents from './../../router';
import Login from './../../pages/login/login';
import Items from './../../pages/items/items';
import Tables from './../../pages/tables/tables';
import Table from './../../pages/table/table';
import Button from './../../components/button/button';

import actions from './../../store/actions';

const { checkToken: checkTokenAction } = actions;

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

    this.props.checkToken(this.props.token)
      .then(() => {
        console.log('Token checked');
        this.setState({
          loading: false,
        });
      }).catch(() => {
        console.log('Token invalid');
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
        component={Items}
        isAuthenticated={this.props.authenticated}
      />,
      <PrivateRoute
        key={1}
        exact
        path="/caixa"
        component={Tables}
        isAuthenticated={this.props.authenticated}
      />,
      <PrivateRoute
        key={2}
        exact
        path="/caixa/:id"
        component={Table}
        isAuthenticated={this.props.authenticated}
      />,
      <GuestRoute
        key={3}
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
  checkToken: PropTypes.func.isRequired,
};

const AuthConnector = connect(state => (
  {
    user: state.auth.user.data,
    authenticated: state.auth.authenticated,
    token: state.auth.token.data,
  }
), dispatch => (
  {
    checkToken: token => (
      dispatch(checkTokenAction(token))
    ),
  }
))(Auth);

export default AuthConnector;
