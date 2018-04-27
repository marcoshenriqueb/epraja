import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './report.styl';

import Button from './../button/button';

const Report = ({
  title,
  report,
}) => (
  <div className="flex-column full-w report-container">
    <div className="flex reports-header full-w">
      <h1>Relatório {title}</h1>
    </div>
    <table className="report full-w">
      <thead className="report--header">
        <tr>
          {
            report.titlesValues.map((t, m) => (
              <th className="report--header--item" key={m.toString()}>
                <div className="flex justify-center font-padding">
                  {t}
                </div>
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody className="report--body">
        {
          report.data.map((day, k) => (
            [...day.data.map((row, m) => (
              <tr
                className="report--row--striped"
                key={`${m.toString()}${k.toString()}${Math.random()}`}
              >
                {
                  report.titlesKeys.map((o, n) => {
                    if (row[o] === undefined) {
                      return null;
                    } else if (moment.isDuration(row[o])) {
                      return (
                        <td
                          className="report--row--column"
                          key={`0${n.toString()}${Math.random()}`}
                        >
                          <div className="flex-column justify-center report--row--cell">
                            { row[o].format('HH:mm:ss', { trim: false }) }
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td
                        className="report--row--column"
                        key={`0${n.toString()}${Math.random()}`}
                      >
                        <div className="flex-column justify-center report--row--cell">
                          { o.includes('total') ? `R$ ${row[o]}` : row[o] }
                        </div>
                      </td>
                    );
                  })
                }
              </tr>
            )),
              <tr className="report--row--subtotal" key={`${(k).toString()}1`}>
                {
                  report.titlesKeys.map((o, m) => {
                    if (day[o] === undefined) {
                      return (
                        <td
                          key={`1${m.toString()}${Math.random()}`}
                          className="report--row--column"
                        />
                      );
                    } else if (moment.isDuration(day[o])) {
                      return (
                        <td
                          className="report--row--column"
                          key={`1${m.toString()}${Math.random()}`}
                        >
                          <div className="flex-column justify-center report--row--cell">
                            { day[o].format('HH:mm:ss', { trim: false }) }
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td
                        className="report--row--column"
                        key={`1${m.toString()}${Math.random()}`}
                      >
                        <div className="flex-column justify-center report--row--cell">
                          { o.includes('total') ? `R$ ${day[o]}` : day[o] }
                        </div>
                      </td>
                    );
                  })
                }
              </tr>]
          ))
        }
        <tr className="report--row--total">
          {
            report.titlesKeys.map((o, m) => {
              if (report[o] === undefined) return null;
              if (o === 'date') {
                return (
                  <td
                    className="report--row--column report--row--period"
                    colSpan={2}
                    key={m.toString()}
                  >
                    <div className="flex-column justify-center report--row--cell">
                      {report[o]}
                    </div>
                  </td>
                );
              } else if (moment.isDuration(report[o])) {
                return (
                  <td className="report--row--column" key={m.toString()}>
                    <div className="flex-column justify-center report--row--cell">
                      { report[o].format('HH:mm:ss', { trim: false }) }
                    </div>
                  </td>
                );
              }
              return (
                <td className="report--row--column" key={m.toString()}>
                  <div className="flex-column justify-center report--row--cell">
                    { o.includes('total') ? `R$ ${report[o]}` : report[o] }
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
        onClick={window.print} // eslint-disable-line
      />
    </div>
  </div>
);

Report.propTypes = {
  title: PropTypes.string.isRequired,
  report: PropTypes.shape({}).isRequired,
};

export default Report;
