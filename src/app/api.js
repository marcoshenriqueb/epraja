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

export default {
  auth: feathersClient.authenticate,
  users: feathersClient.service('users'),
};
