import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './auth.styl';

import routeComponents from './../../router';
import Login from './../../pages/login/login';
import Items from './../../pages/items/items';
import Table from './../../pages/table/table';
import Button from './../../components/button/button';
import ReportsConnector from './../../pages/reports/reports';

import actions from './../../store/actions';

const { checkToken: checkTokenAction, logout: logoutAction } = actions;

const { PrivateRoute, GuestRoute } = routeComponents;

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.token.length,
    };

    this.logout = this.logout.bind(this);
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

  logout() {
    this.props.logout();
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
        path="/caixa/:id"
        component={Table}
        isAuthenticated={this.props.authenticated}
      />,
      <PrivateRoute
        key={2}
        exact
        path="/relatorios"
        component={ReportsConnector}
        isAuthenticated={this.props.authenticated}
      />,
      <GuestRoute
        key={3}
        path="/login"
        component={Login}
        isAuthenticated={this.props.authenticated}
      />,
    ];

    const navs = [];
    if (this.props.location.pathname !== '/') {
      navs
        .push(<Link to="/"><Button onClick={() => {}} text="Home" type="primary" key="1" /></Link>);
    }
    navs.push(<Button onClick={this.logout} text="Sair" type="primary" key="2" />);

    return this.props.authenticated ?
      (
        <div className="full-w flex-column">
          <div className="full-w flex header space-between">
            <span>&nbsp;</span>
            <span>É pra já</span>
            <div className="flex navs">
              {navs}
            </div>
          </div>
          <div className="full-w main-content">
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
  authenticated: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  checkToken: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const AuthConnector = connect(state => (
  {
    authenticated: state.auth.authenticated,
    token: state.auth.token.data,
  }
), dispatch => (
  {
    checkToken: token => (
      dispatch(checkTokenAction(token))
    ),
    logout: () => (
      dispatch(logoutAction())
    ),
  }
))(Auth);

export default AuthConnector;
