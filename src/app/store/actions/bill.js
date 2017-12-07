import api from './../../api';
import store from './../../store';

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

const addBill = bill => (
  {
    type: 'ADD_BILL',
    bill,
  }
);

const createdCallback = (message) => {
  if (store.getState().auth.user.data.business !== message.business) return;

  store.dispatch(addBill(message));
};

const updateBill = bill => (
  {
    type: 'UPDATE_BILL',
    bill,
  }
);

const updatedCallback = (message) => {
  if (store.getState().auth.user.data.business !== message.business) return;

  store.dispatch(updateBill(message));
};

const removeBill = bill => (
  {
    type: 'REMOVE_BILL',
    bill,
  }
);

const removedCallback = (message) => {
  if (store.getState().auth.user.data.business !== message.business) return;

  store.dispatch(removeBill(message));
};

const fetchBills = (query = {}) => (
  (dispatch) => {
    dispatch(requestBills());

    api.bills.on('created', createdCallback);
    api.bills.on('patched', updatedCallback);
    api.bills.on('updated', updatedCallback);
    api.bills.on('removed', removedCallback);

    return api.bills.find({
      query: {
        business: store.getState().auth.user.data.business,
        ...query,
      },
    }).then((response) => {
      dispatch(receiveBills(response.data));
      return response;
    }, (error) => {
      dispatch(receiveBills([]));
      return error;
    });
  }
);

const resetBillsState = () => (
  {
    type: 'RESET_BILLS',
  }
);

const resetBills = () => (
  (dispatch) => {
    api.bills.removeListener('created', createdCallback);
    api.bills.removeListener('patched', updatedCallback);
    api.bills.removeListener('updated', updatedCallback);
    api.bills.removeListener('removed', removedCallback);

    dispatch(resetBillsState());
  }
);

export default {
  fetchBills,
  resetBills,
};
