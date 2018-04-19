import React from 'react';
import PropTypes from 'prop-types';

import './report.styl';

const Report = ({
  reportTitle,
  titlesKeys,
  titlesValues,
  data,
  blankRows,
}) => (
  <div className="full-w flex-column">
    <div className="flex reports-header full-w">
      <h1>{reportTitle}</h1>
    </div>
    <table className="table">
      <thead className="table--header">
        <tr>
          {
            titlesValues.map(t => (
              <th className="table--header--item" key={t}>
                <div className="flex start">
                  {t}
                </div>
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((i, k) => (
            <tr className="table--row--striped" key={i._id + k.toString()}>
              {
                titlesKeys.map((o, m) => {
                  if (i[o] === undefined) return null;
                  return (
                    <td className="table--row--column" key={`${i._id}_${o}`}>
                      <div className="flex-column start justify-center table--row--cell">
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

Report.propTypes = {
  reportTitle: PropTypes.string.isRequired,
  titlesKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  titlesValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  blankRows: PropTypes.bool,
};

Report.defaultProps = {
  blankRows: false,
};

export default Report;
