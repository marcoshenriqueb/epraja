import api from './../../api';

const requestBills = () => (
  {
    type: 'REQUEST_BILLS',
  }
);

const receiveBills = bills => (
  {
    type: 'RECEIVE_BILLS',
    bills,
  }
);

const fetchBills = () => (
  (dispatch) => {
    dispatch(requestBills());

    return api.bills.find({})
      .then((response) => {
        dispatch(receiveBills(response.data));
        return response;
      }, (error) => {
        dispatch(receiveBills([]));
        return error;
      });
  }
);

export default {
  fetchBills,
};
