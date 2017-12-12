import api from './../../api';

const requestSurveyRates = () => (
  {
    type: 'REQUEST_SURVEY_RATES',
  }
);

const receiveSurveyRates = rates => (
  {
    type: 'RECEIVE_SURVEY_RATES',
    rates,
  }
);

const fetchSurveyRates = () => (
  (dispatch) => {
    dispatch(requestSurveyRates());

    return api.surveyRates.find({})
      .then((response) => {
        dispatch(receiveSurveyRates(response.data));
        return response;
      }, (error) => {
        dispatch(receiveSurveyRates([]));
        return error;
      });
  }
);

const resetSurveyRatesState = () => (
  {
    type: 'RESET_SURVEY_RATES',
  }
);

const resetSurveyRates = () => (
  (dispatch) => {
    dispatch(resetSurveyRatesState());
  }
);

export default {
  fetchSurveyRates,
  resetSurveyRates,
};
