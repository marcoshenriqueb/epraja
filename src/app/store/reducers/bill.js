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

    case 'ADD_BILL':
      return Object.assign({}, state, {
        bills: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: [...state.bills.data, action.bill],
        },
      });

    case 'UPDATE_BILL':
      return Object.assign({}, state, {
        bills: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: state.bills.data.map((b) => {
            if (b._id === action.bill._id) {
              return action.bill;
            }

            return b;
          }),
        },
      });

    case 'REMOVE_BILL':
      return Object.assign({}, state, {
        bills: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: state.bills.data.filter(b => b._id !== action.bill._id),
        },
      });

    case 'RESET_BILLS':
      return initialState;

    default:
      return state;
  }
};

export default bill;
