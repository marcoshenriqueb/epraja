import React from 'react';
import PropTypes from 'prop-types';
import './report.styl';

import ReportComponent from './../../components/report/report';

const Report = ({
  match,
  location,
}) => (
  <div className="full-w flex-column">
    <ReportComponent

    />
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
