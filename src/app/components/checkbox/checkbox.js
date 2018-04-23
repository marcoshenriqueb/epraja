import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './checkbox.styl';

const Checkbox = ({
  checked,
  label,
  onChange,
}) => (
  <Button
    text={checked ? 'X' : ''}
    onClick={() => onChange(label, checked)}
    type="checkbox"
    size="checkbox"
  />
);

Checkbox.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

Checkbox.defaultProps = {
  onChange: () => {},
  checked: false,
};

export default Checkbox;
