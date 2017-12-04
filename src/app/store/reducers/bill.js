const initialState = {
  bills: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const bill = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_BILLS':
      return Object.assign({}, state, {
        bills: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_BILLS':
      return Object.assign({}, state, {
        bills: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.bills,
        },
      });

    default:
      return state;
  }
};

export default bill;
