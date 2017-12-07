import api from './../../api';

const requestBillStatuses = () => (
  {
    type: 'REQUEST_BILL_STATUSES',
  }
);

const receiveBillStatuses = statuses => (
  {
    type: 'RECEIVE_BILL_STATUSES',
    statuses,
  }
);

const fetchBillStatuses = () => (
  (dispatch) => {
    dispatch(requestBillStatuses());

    return api.billStatuses.find({})
      .then((response) => {
        dispatch(receiveBillStatuses(response.data));
        return response;
      }, (error) => {
        dispatch(receiveBillStatuses([]));
        return error;
      });
  }
);

const resetBillStatusesState = () => (
  {
    type: 'RESET_BILL_STATUSES',
  }
);

const resetBillStatuses = () => (
  (dispatch) => {
    dispatch(resetBillStatusesState());
  }
);

export default {
  fetchBillStatuses,
  resetBillStatuses,
};
