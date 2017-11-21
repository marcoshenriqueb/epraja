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

const fetchUser = () => (
  (dispatch) => {
    dispatch(requestUser());

    return api.users.find({ email: 'marcos@gmail.com' })
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
      dispatch(receiveToken(response.accessToken, true));
      fetchUser()(dispatch);
      return response;
    }, (error) => {
      dispatch(receiveToken('', false));
      return error;
    });
  }
);

export default {
  receiveToken,
  requestToken,
  login,
  fetchUser,
  checkToken,
};
