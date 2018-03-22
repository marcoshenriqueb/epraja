import React from 'react';
import PropTypes from 'prop-types';

import './table.styl';

const Table = ({
  titlesKeys,
  titlesValues,
  data,
  blankRows,
}) => (
  <div className="full-w flex-column">
    <table>
      <thead>
        <tr>
          {
            titlesValues.map(t => (
              <th key={t}>{t}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((i, k) => (
            <tr className={`blank--rows--${blankRows}`} key={i._id + k.toString()}>
              {
                titlesKeys.map((o) => {
                  if (i[o] === undefined) return null;
                  return (
                    <th className={`blank--rows--${blankRows}`} key={`${i._id}_${o}`}>
                      {i[o]}
                    </th>
                  );
                })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

Table.propTypes = {
  titlesKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  titlesValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  blankRows: PropTypes.bool,
};

Table.defaultProps = {
  blankRows: false,
};

export default Table;
