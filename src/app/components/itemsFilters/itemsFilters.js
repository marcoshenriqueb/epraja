import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './itemsFilters.styl';

const ItemsFilters = ({
  categories,
  statuses,
  changeCategories,
  changeStatuses,
  getFilterClass,
}) => (
  <div className="full-w flex space-between">
    <div className="flex">
      {
        statuses.map(s => (
          <Button
            type={`${getFilterClass(s)}`}
            onClick={() => changeStatuses(s)}
            key={s}
            text={s}
          />
        ))
      }
    </div>
    <div className="flex">
      {
        categories.map(c => (
          <Button
            type={`${getFilterClass(c)}`}
            onClick={() => changeCategories(c)}
            key={c}
            text={c}
          />
        ))
      }
    </div>
  </div>
);

ItemsFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeCategories: PropTypes.func.isRequired,
  changeStatuses: PropTypes.func.isRequired,
  getFilterClass: PropTypes.func.isRequired,
};

export default ItemsFilters;
