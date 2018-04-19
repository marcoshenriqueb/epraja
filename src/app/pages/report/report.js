import React from 'react';
import PropTypes from 'prop-types';
import './report.styl';

const Report = ({
  match,
  location,
}) => (
  <div className="flex-column full-w report-container">
    <div className="flex reports-header full-w">
      <h1>Relatório {match.params.type}</h1>
    </div>
    <table className="table full-w">
      <thead className="table--header">
        <tr>
          {
            location.state.report.titlesValues.map(t => (
              <th className="table--header--item" key={t}>
                <div className="flex justify-center">
                  {t}
                </div>
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody className="table--body">
        {
          location.state.report.data.map((day, k) => (
            <tr className="table--row--striped" key={k.toString()}>
              <td className="table--row--column" key={`data${k.toString()}`}>
                <div className="flex-column justify-center table--row--cell">
                  {day.date}
                </div>
              </td>
              {
                day.data.map(row => (
                  location.state.report.titlesKeys.map((o, m) => {
                    if (row[o] === undefined) return null;
                    return (
                      <td className="table--row--column" key={m.toString()}>
                        <div className="flex-column justify-center table--row--cell">
                          {row[o]}
                        </div>
                      </td>
                    );
                  })
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

Report.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      report: PropTypes.shape({}).isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ type: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default Report;
