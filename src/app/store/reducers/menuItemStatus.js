const initialState = {
  menuItemStatuses: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const menuItemStatus = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_MENU_ITEM_STATUSES':
      return Object.assign({}, state, {
        menuItemStatuses: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_MENU_ITEM_STATUSES':
      return Object.assign({}, state, {
        menuItemStatuses: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.statuses,
        },
      });

    case 'RESET_MENU_ITEM_STATUSES':
      return initialState;

    default:
      return state;
  }
};

export default menuItemStatus;
