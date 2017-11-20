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
      }, (error) => {
        console.log(error);
        dispatch(receiveUser({}));
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
    }, (error) => {
      console.log(error);
      dispatch(receiveToken('', false));
    });
  }
);

const login = () => (
  (dispatch) => {
    dispatch(requestToken());

    return api.auth({
      strategy: 'local',
      email: 'marcos@gmail.com',
      password: '123456',
    }).then((response) => {
      dispatch(receiveToken(response.accessToken, true));
      fetchUser()(dispatch);
    }, (error) => {
      console.log(error);
      dispatch(receiveToken('', false));
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
