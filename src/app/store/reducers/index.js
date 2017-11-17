import { combineReducers } from 'redux';

const auth = (state = { user: {}, authenticated: false, token: '' }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, {
        user: action.user,
      });

    case 'SET_AUTHENTICATED':
      return Object.assign({}, state, {
        authenticated: action.authenticated,
      });

    case 'SET_TOKEN':
      return Object.assign({}, state, {
        token: action.token,
      });

    default:
      return state;
  }
};

const store = combineReducers({
  auth,
});

export default store;
