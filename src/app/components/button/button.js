import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './button.styl';

const Button = ({
  text,
  onClick,
  type,
  size,
  link,
  classes,
}) => {
  const button = (
    <button
      className={`button button--${type} button--${size} ${classes}`}
      onClick={onClick}
    >
      { text }
    </button>
  );

  if (!link.length) {
    return button;
  }

  return (
    <Link to={link}>
      { button }
    </Link>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.string,
  classes: PropTypes.string,
};

Button.defaultProps = {
  type: 'default',
  size: 'medium',
  link: '',
  onClick: () => {},
  classes: '',
};

export default Button;
