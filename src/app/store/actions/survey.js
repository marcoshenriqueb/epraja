import api from './../../api';
import store from './../../store';

const requestSurveys = () => (
  {
    type: 'REQUEST_SURVEYS',
  }
);

const receiveSurveys = surveys => (
  {
    type: 'RECEIVE_SURVEYS',
    surveys,
  }
);

const fetchSurveys = () => (
  (dispatch) => {
    dispatch(requestSurveys());

    return api.surveys.find({
      query: {
        business: store.getState().auth.user.data.business,
      },
    }).then((response) => {
      dispatch(receiveSurveys(response.data));
      return response;
    }, (error) => {
      dispatch(receiveSurveys([]));
      return error;
    });
  }
);

const resetSurveysState = () => (
  {
    type: 'RESET_SURVEYS',
  }
);

const resetSurveys = () => (
  (dispatch) => {
    dispatch(resetSurveysState());
  }
);

export default {
  fetchSurveys,
  resetSurveys,
};
