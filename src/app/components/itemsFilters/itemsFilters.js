import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './itemsFilters.styl';

const ItemsFilters = ({
  categories,
  statuses,
  changeFilter,
  getFilterClass,
}) => (
  <div className="full-w flex space-between">
    <div className="flex">
      {
        statuses.map(s => (
          <Button
            type={getFilterClass(s)}
            onClick={() => changeFilter(s)}
            key={s}
            text={s}
            classes="capitalize"
          />
        ))
      }
    </div>
    <div className="flex">
      {
        categories.map(c => (
          <Button
            type={getFilterClass(c)}
            onClick={() => changeFilter(c)}
            key={c}
            text={c}
            classes="capitalize"
          />
        ))
      }
      <Button
        type={getFilterClass('aberta')}
        onClick={() => changeFilter('aberta')}
        text="Caixa"
      />
    </div>
  </div>
);

ItemsFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeFilter: PropTypes.func.isRequired,
  getFilterClass: PropTypes.func.isRequired,
};

export default ItemsFilters;
