const fetch = () => (
  new Promise((resolve) => {
    resolve('osnianfoisanfnafnafao');
  })
);

const requestToken = () => (
  {
    type: 'REQUEST_TOKEN',
  }
);

const receiveToken = (token, auth) => (
  {
    type: 'RECEIVE_TOKEN',
    token,
    auth,
  }
);

const login = () => (
  (dispatch) => {
    dispatch(requestToken());

    return fetch()
      .then((response) => {
        dispatch(receiveToken(response, true));
      }, (error) => {
        console.log(error);
        dispatch(receiveToken('', false));
      });
  }
);

const requestUser = () => (
  {
    type: 'REQUEST_USER',
  }
);

const receiveUser = user => (
  {
    type: 'RECEIVE_USER',
    user,
  }
);

const fetchUser = () => (
  (dispatch) => {
    dispatch(requestUser());

    return fetch()
      .then((response) => {
        dispatch(receiveUser(response));
      }, (error) => {
        console.log(error);
        dispatch(receiveUser({}));
      });
  }
);

export default {
  receiveToken,
  requestToken,
  login,
  fetchUser,
};
