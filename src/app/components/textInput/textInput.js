import React from 'react';
import PropTypes from 'prop-types';
import './textInput.styl';

import Lupa from './../../../assets/images/lupa.png';

const TextInput = ({
  value,
  name,
  placeholder,
  type,
  onChange,
}) => (
  <div className="text-input--container flex">
    <input
      className="text-input"
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
    <div className="flex justify-center div-icon">
      <img alt="Lupa" src={Lupa} />
    </div>
  </div>

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
