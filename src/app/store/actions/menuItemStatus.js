import api from './../../api';

const requestMenuItemStatuses = () => (
  {
    type: 'REQUEST_MENU_ITEM_STATUSES',
  }
);

const receiveMenuItemStatuses = statuses => (
  {
    type: 'RECEIVE_MENU_ITEM_STATUSES',
    statuses,
  }
);

const fetchMenuItemStatuses = () => (
  (dispatch) => {
    dispatch(requestMenuItemStatuses());

    return api.menuItemStatuses.find({})
      .then((response) => {
        dispatch(receiveMenuItemStatuses(response.data));
        return response;
      }, (error) => {
        dispatch(receiveMenuItemStatuses([]));
        return error;
      });
  }
);

const resetMenuItemStatusesState = () => (
  {
    type: 'RESET_MENU_ITEM_STATUSES',
  }
);

const resetMenuItemStatuses = () => (
  (dispatch) => {
    dispatch(resetMenuItemStatusesState());
  }
);

export default {
  fetchMenuItemStatuses,
  resetMenuItemStatuses,
};
