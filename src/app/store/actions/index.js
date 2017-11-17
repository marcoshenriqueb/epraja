const checkToken = (token) => {
  console.log(1, token);
  return {
    type: 'SET_TOKEN',
    token: '',
    auth: false,
  };
};

export default {
  checkToken,
};
