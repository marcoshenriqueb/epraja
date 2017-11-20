const initialState = {
  user: {
    isFetching: false,
    lastUpdated: '',
    data: {},
  },
  authenticated: false,
  token: {
    isFetching: false,
    lastUpdated: '',
    data: '',
  },
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_USER':
      return Object.assign({}, state, {
        user: {
          isFetching: true,
          lastUpdated: '',
          data: {},
        },
      });

    case 'RECEIVE_USER':
      return Object.assign({}, state, {
        user: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.user,
        },
      });

    case 'REQUEST_TOKEN':
      return Object.assign({}, state, {
        token: {
          data: '',
          isFetching: true,
          lastUpdated: '',
        },
        authenticated: false,
      });

    case 'RECEIVE_TOKEN':
      return Object.assign({}, state, {
        token: {
          data: action.token,
          isFetching: false,
          lastUpdated: Date.now(),
        },
        authenticated: action.auth,
      });

    default:
      return state;
  }
};

const store = {
  auth,
};

export default store;
