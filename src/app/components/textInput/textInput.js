import React from 'react';
import PropTypes from 'prop-types';
import './textInput.styl';

const TextInput = ({
  value,
  name,
  placeholder,
  type,
  onChange,
}) => (
  <input
    className="text-input"
    type={type}
    placeholder={placeholder}
    name={name}
    value={value}
    onChange={onChange}
  />
);

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextInput.defaultProps = {
  placeholder: '',
  type: 'text',
};

export default TextInput;
