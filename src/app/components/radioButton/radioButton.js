import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './radioButton.styl';

const RadioButton = ({
  statuses,
  checked,
  updateBillItemStatus,
  item,
}) => (
  <div className="full-w flex">
    {
      statuses.map((s, k) => (
        <Button
          onClick={() => { updateBillItemStatus(item, s._id); }}
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
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  checked: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateBillItemStatus: PropTypes.func,
  item: PropTypes.string,
};

RadioButton.defaultProps = {
  updateBillItemStatus: () => {},
  item: '',
};


export default RadioButton;
