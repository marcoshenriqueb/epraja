import React from 'react';
import PropTypes from 'prop-types';
import './button.styl';

const Button = ({
  text,
  onClick,
  type,
}) => (
  <button
    className={`button button--${type}`}
    onClick={onClick}
  >
    { text }
  </button>
);

Button.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  type: 'default',
};

export default Button;
