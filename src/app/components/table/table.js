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
              <th>{t}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((i, k) => (
            <tr key={k._id}>
              {
                Object.entries(i).map((o) => {
                  let newValue = '';
                  console.log(o);
                  for (let m = 0; m < headTitles.length; m += 1) {
                    if (o[1] === headTitles[m].toLowerCase()) {
                      newValue = o.value;
                      break;
                    }
                  }
                  return (
                    <th>
                      {newValue}
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
  headTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
