import api from './../../api';
import store from './../../store';

const requestMenuCategories = () => (
  {
    type: 'REQUEST_MENU_CATEGORIES',
  }
);

const receiveMenuCategories = categories => (
  {
    type: 'RECEIVE_MENU_CATEGORIES',
    categories,
  }
);

const fetchMenuCategories = () => (
  (dispatch) => {
    dispatch(requestMenuCategories());
    console.log(store.getState().auth.user.data);
    return api.menuCategories.find({
      query: {
        business: store.getState().auth.user.data.business,
      },
    }).then((response) => {
      dispatch(receiveMenuCategories(response.data));
      return response;
    }, (error) => {
      dispatch(receiveMenuCategories([]));
      return error;
    });
  }
);

const resetMenuCategoriesState = () => (
  {
    type: 'RESET_MENU_CATEGORIES',
  }
);

const resetMenuCategories = () => (
  (dispatch) => {
    dispatch(resetMenuCategoriesState());
  }
);

export default {
  fetchMenuCategories,
  resetMenuCategories,
};
