import api from './../../api';
import store from './../../store';

const requestMenuItems = () => (
  {
    type: 'REQUEST_MENU_ITEMS',
  }
);

const receiveMenuItems = items => (
  {
    type: 'RECEIVE_MENU_ITEMS',
    items,
  }
);

const fetchMenuItems = () => (
  (dispatch) => {
    dispatch(requestMenuItems());

    return api.menuItems.find({
      query: {
        business: store.getState().auth.user.data.business,
      },
    }).then((response) => {
      dispatch(receiveMenuItems(response.data));
      return response;
    }, (error) => {
      dispatch(receiveMenuItems([]));
      return error;
    });
  }
);

const resetMenuItemsState = () => (
  {
    type: 'RESET_MENU_ITEMS',
  }
);

const resetMenuItems = () => (
  (dispatch) => {
    dispatch(resetMenuItemsState());
  }
);

export default {
  fetchMenuItems,
  resetMenuItems,
};
