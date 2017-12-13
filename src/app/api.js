import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import auth from 'feathers-authentication-client';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL, {
  transports: ['websocket'],
});

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(auth({
    storage: window.localStorage, // eslint-disable-line
  }));

feathersClient.hooks({
  error(hook) {
    if (hook.error.className === 'not-authenticated') {
      console.log('not-authenticated');
    }
  },
});

export default {
  auth: feathersClient.authenticate,
  logout: feathersClient.logout,
  users: feathersClient.service('users'),
  bills: feathersClient.service('bills'),
  billStatuses: feathersClient.service('bill-statuses'),
  menuItems: feathersClient.service('menu-items'),
  menuItemStatuses: feathersClient.service('menu-item-statuses'),
  menuCategories: feathersClient.service('menu-categories'),
  surveyRates: feathersClient.service('survey-rates'),
  surveys: feathersClient.service('surveys'),
};
