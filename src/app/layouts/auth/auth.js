import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './auth.styl';

import Button from './../../components/button/button';

const Auth = ({ user, children }) => (
  (
    <div className="full-w flex-column">
      <div className="full-w flex header">
        { user.email }
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
          size="big"
          text="Caixa"
        />
        <Button
          size="big"
          text="Relatórios de Satisfação"
        />
      </div>
      <div className="full-w">
        { children }
      </div>
    </div>
  )
);

Auth.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.shape({}).isRequired,
};

const AuthConnector = connect(state => (
  {
    user: state.auth.user.data,
  }
))(Auth);

export default AuthConnector;
