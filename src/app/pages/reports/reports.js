import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import moment from 'moment';
import './reports.styl';

import actions from './../../store/actions';

const {
  fetchSurveys: fetchSurveysAction,
  resetSurveys: resetSurveysAction,
  fetchSurveyRates: fetchSurveyRatesAction,
  resetSurveyRates: resetSurveyRatesAction,
} = actions;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const MONTHS_COUNT = 3;

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

  getAggregateSurveys() {
    return this.props.surveyRates.data.map((r) => {
      let count = 0;
      this.props.surveys.data.forEach((s) => {
        if (s.surveyRate === r._id) {
          count += 1;
        }
      });

      return Object.assign({}, r, { value: count });
    });
  }

  getMonthlyAggregateSurveys() {
    return [...Array(MONTHS_COUNT).keys()].map((key) => {
      const data = { name: moment().subtract(MONTHS_COUNT - (key + 1), 'months').format('MMMM') };

      this.props.surveyRates.data.forEach((r) => {
        this.props.surveys.data.forEach((s, i) => {
          if (i === 0) {
            data[r.name] = 0;
          }

          if (
            moment(s.createdAt).format('MMMM') !== data.name ||
            r._id !== s.surveyRate
          ) return;

          data[r.name] += 1;
        });
      });

      return data;
    });
  }

  render() {
    return (
      <div className="full-w flex start wrap reports-container">
        <PieChart width={400} height={400}>
          <Pie
            isAnimationActive={false}
            data={this.getAggregateSurveys()}
            dataKey="value"
            cx={200}
            cy={200}
            outerRadius={80}
            fill="red"
            label
          >
            {
              this.getAggregateSurveys()
              .map((entry, index) =>
                <Cell key={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
        <BarChart
          width={600}
          height={300}
          data={this.getMonthlyAggregateSurveys()}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {
            this.props.surveyRates.data.map((r, i) => (
              <Bar key={r.name} dataKey={r.name} fill={COLORS[i % COLORS.length]} />
            ))
          }
        </BarChart>
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
