const initialState = {
  billStatuses: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const billStatus = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_BILL_STATUSES':
      return Object.assign({}, state, {
        billStatuses: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_BILL_STATUSES':
      return Object.assign({}, state, {
        billStatuses: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.statuses,
        },
      });

    case 'RESET_BILL_STATUSES':
      return initialState;

    default:
      return state;
  }
};

export default billStatus;
