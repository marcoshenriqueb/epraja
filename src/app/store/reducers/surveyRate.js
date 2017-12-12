const initialState = {
  surveyRates: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const surveyRate = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_SURVEY_RATES':
      return Object.assign({}, state, {
        surveyRates: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_SURVEY_RATES':
      return Object.assign({}, state, {
        surveyRates: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.rates,
        },
      });

    case 'RESET_SURVEY_RATES':
      return initialState;

    default:
      return state;
  }
};

export default surveyRate;
