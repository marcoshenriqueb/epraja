import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './itemsFilters.styl';

const ItemsFilters = ({ categories, statuses }) => (
  <div className="full-w flex space-between">
    <div className="flex">
      {
        statuses.map(s => (
          <Button
            onClick={this.changeCategory}
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
            onClick={this.changeCategory}
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
};

export default ItemsFilters;
