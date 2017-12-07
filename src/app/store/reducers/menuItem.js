const initialState = {
  menuItems: {
    isFetching: false,
    lastUpdated: '',
    data: [],
  },
};

const menuItem = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_MENU_ITEMS':
      return Object.assign({}, state, {
        menuItems: {
          isFetching: true,
          lastUpdated: '',
          data: [],
        },
      });

    case 'RECEIVE_MENU_ITEMS':
      return Object.assign({}, state, {
        menuItems: {
          isFetching: false,
          lastUpdated: Date.now(),
          data: action.items,
        },
      });

    case 'RESET_MENU_ITEMS':
      return initialState;

    default:
      return state;
  }
};

export default menuItem;
