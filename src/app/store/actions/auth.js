import api from './../../api';

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

const resetUser = () => (
  {
    type: 'RESET_USER',
  }
);

const fetchUser = email => (
  (dispatch) => {
    dispatch(requestUser());

    return api.users.find({ email })
      .then((response) => {
        dispatch(receiveUser(response.data[0]));
        return response;
      }, (error) => {
        dispatch(receiveUser({}));
        return error;
      });
  }
);

const checkToken = token => (
  (dispatch) => {
    dispatch(requestToken());

    return api.auth({
      strategy: 'jwt',
      accessToken: token,
    }).then((response) => {
      dispatch(receiveToken(response.accessToken, true));
      return response;
    }, (error) => {
      dispatch(receiveToken('', false));
      return error;
    });
  }
);

const login = credentials => (
  (dispatch) => {
    dispatch(requestToken());

    return api.auth({
      strategy: 'local',
      ...credentials,
    }).then((response) => {
      fetchUser(credentials.email)(dispatch).then(() => {
        dispatch(receiveToken(response.accessToken, true));
      });
      return response;
    }, (error) => {
      dispatch(receiveToken('', false));
      return error;
    });
  }
);

const logout = () => (
  (dispatch) => {
    dispatch(requestToken());

    return api.logout().then((response) => {
      dispatch(receiveToken('', false));
      dispatch(resetUser());
      return response;
    }, error => error);
  }
);

export default {
  receiveToken,
  requestToken,
  login,
  logout,
  fetchUser,
  checkToken,
};
