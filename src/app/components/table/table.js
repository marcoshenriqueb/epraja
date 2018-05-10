import React from 'react';
import PropTypes from 'prop-types';

import './table.styl';

const Table = ({
  titlesKeys,
  titlesValues,
  data,
  blankRows,
  sort,
}) => (
  <div className="full-w flex-column">
    <table className="table">
      <thead className="table--header">
        <tr>
          {
            titlesValues.map((t) => {
              if (t === null) {
                return <th className="table--header--blank-item" key={t} />;
              }

              return (
                <th className="table--header--item" key={t}>
                  <div className="flex start font-padding" onClick={() => sort(t)}>
                    {t}
                  </div>
                </th>
              );
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((i, k) => (
            <tr
              className={blankRows ? 'table--row--blank' : 'table--row--striped'}
              key={i._id + k.toString()}
            >
              {
                titlesKeys.map((o) => {
                  if (i[o] === undefined) return null;
                  return (
                    <td className="table--row--column" key={`${i._id}_${o}`}>
                      <div
                        className={
                          `flex justify-center
                          ${o === 'status' ? 'table--row--status' : 'table--row--cell'}`
                        }
                      >
                        {i[o]}
                      </div>
                      <div className="table--row--blank--item" />
                    </td>
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
  sort: PropTypes.func,
};

Table.defaultProps = {
  blankRows: false,
  sort: () => {},
};

export default Table;
