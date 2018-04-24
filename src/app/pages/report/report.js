import React from 'react';
import PropTypes from 'prop-types';
import './report.styl';

import Button from './../../components/button/button';

const Report = ({
  match,
  location,
}) => (
  <div id="page" className="flex-column full-w report-container">
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
            [...day.data.map((row, m) => (
              <tr className="table--row--striped" key={m.toString()}>
                {
                  location.state.report.titlesKeys.map((o, n) => {
                    if (row[o] === undefined) return null;
                    return (
                      <td className="table--row--column" key={n.toString()}>
                        <div className="flex-column justify-center table--row--cell">
                          {row[o]}
                        </div>
                      </td>
                    );
                  })
                }
              </tr>
            )),
              <tr className="table--row--subtotal" key={`${(k).toString()}1`}>
                {
                  location.state.report.titlesKeys.map((o, m) => {
                    if (day[o] === undefined) return <td key={m.toString()} className="table--row--column" />;
                    return (
                      <td className="table--row--column" key={m.toString()}>
                        <div className="flex-column justify-center table--row--cell">
                          {day[o]}
                        </div>
                      </td>
                    );
                  })
                }
              </tr>]
          ))
        }
        <tr className="table--row--total">
          {
            location.state.report.titlesKeys.map((o, m) => {
              if (location.state.report[o] === undefined) return null;
              if (o === 'date') {
                return (
                  <td
                    className="table--row--column table--row--period"
                    colSpan={2}
                    key={m.toString()}
                  >
                    <div className="flex-column justify-center table--row--cell">
                      {location.state.report[o]}
                    </div>
                  </td>
                );
              }
              return (
                <td className="table--row--column" key={m.toString()}>
                  <div className="flex-column justify-center table--row--cell">
                    {location.state.report[o]}
                  </div>
                </td>
              );
            })
          }
        </tr>
      </tbody>
    </table>
    <div className="flex justify-end full-w print--button">
      <Button
        text="Imprimir"
        type="secondary"
        size="big"
      />
    </div>
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
