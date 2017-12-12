import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './reports.styl';

import actions from './../../store/actions';

const {
  fetchSurveys: fetchSurveysAction,
  resetSurveys: resetSurveysAction,
  fetchSurveyRates: fetchSurveyRatesAction,
  resetSurveyRates: resetSurveyRatesAction,
} = actions;

class Reports extends React.Component {
  componentDidMount() {
    this.props.fetchSurveys();
    this.props.fetchSurveyRates();
  }

  componentWillUnmount() {
    this.props.resetSurveys();
    this.props.resetSurveyRates();
  }

  getSurveyRate(id) {
    const result = this.props.surveyRates.data.filter(r => r._id === id);

    return result.length ? result[0] : {};
  }

  render() {
    console.log(this.props.surveys);
    return (
      <div className="full-w flex start">
        <h1>Hey</h1>
      </div>
    );
  }
}

Reports.propTypes = {
  surveys: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  surveyRates: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchSurveys: PropTypes.func.isRequired,
  resetSurveys: PropTypes.func.isRequired,
  fetchSurveyRates: PropTypes.func.isRequired,
  resetSurveyRates: PropTypes.func.isRequired,
};

const ReportsConnector = connect(state => (
  {
    surveys: state.survey.surveys,
    surveyRates: state.surveyRate.surveyRates,
  }
), dispatch => (
  {
    fetchSurveys: query => (
      dispatch(fetchSurveysAction(query))
    ),
    resetSurveys: () => (
      dispatch(resetSurveysAction())
    ),
    fetchSurveyRates: () => (
      dispatch(fetchSurveyRatesAction())
    ),
    resetSurveyRates: () => (
      dispatch(resetSurveyRatesAction())
    ),
  }
))(Reports);

export default ReportsConnector;
