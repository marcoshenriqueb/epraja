import React from 'react';
import PropTypes from 'prop-types';

import './table.styl';

const Table = ({
  headTitles,
  data,
}) => (
  <div className="full-w flex-column">
    <table>
      <thead>
        <tr>
          {
            headTitles.map(t => (
              <th key={t}>{t}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((i, k) => (
            <tr key={`${Date.now()}_${k._id}`}>
              {
                Object.entries(i).map((o) => {
                  console.log(headTitles.indexOf(o[0]));
                  if (headTitles.indexOf(o[0]) >= 0) {
                    return (
                      <th key={`${k._id}_${o[0]}`}>
                        {o[1]}
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
  headTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
