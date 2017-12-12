const initialState = {
  surveys: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const survey = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_SURVEYS':
      return Object.assign({}, state, {
        surveys: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_SURVEYS':
      return Object.assign({}, state, {
        surveys: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.surveys,
        },
      });

    case 'RESET_SURVEYS':
      return initialState;

    default:
      return state;
  }
};

export default survey;
