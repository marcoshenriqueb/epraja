import React from 'react';
import PropTypes from 'prop-types';
import './textInput.styl';

const TextInput = ({
  value,
  name,
  placeholder,
  type,
  onChange,
  icon,
  size,
}) => (
  <div className="text-input--container flex">
    <input
      className={`text-input text-input-${size}`}
      type={type}
      min={type === 'number' ? 0 : null}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
    {icon}
  </div>

);

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.shape({}),
  size: PropTypes.string,
};

TextInput.defaultProps = {
  placeholder: '',
  type: 'text',
  icon: null,
  size: 'medium',
};

export default TextInput;
