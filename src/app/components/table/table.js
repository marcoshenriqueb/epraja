import React from 'react';
import PropTypes from 'prop-types';

import './table.styl';

const Table = ({
  titlesKeys,
  titlesValues,
  data,
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
            <tr key={i._id + k.toString()}>
              {
                titlesKeys.map((o) => {
                  if (Object.keys(i).indexOf(o) >= 0) {
                    console.log(i);
                    return (
                      <th key={`${i._id}_${o}`}>
                        {Object.values(i)[Object.keys(i).indexOf(o)]}
                      </th>
                    );
                  }
                  return null;
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
};

export default Table;
