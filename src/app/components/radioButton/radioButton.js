import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './radioButton.styl';

const RadioButton = ({
  options,
  checked,
  updateBillItemStatus,
}) => (
  <div className="full-w flex">
    {
      options.map((s, k) => (
        <Button
          onClick={() => { updateBillItemStatus(s._id); }}
          key={s._id}
          text={s.name}
          type={checked[k]}
          size=""
        />
      ))
    }
  </div>
);

RadioButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  checked: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateBillItemStatus: PropTypes.func,
};

RadioButton.defaultProps = {
  updateBillItemStatus: () => {},
};


export default RadioButton;
