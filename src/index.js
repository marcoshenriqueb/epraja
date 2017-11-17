import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './assets/stylus/index.styl';
import App from './app/App';
import Store from './app/store/reducers';
// import registerServiceWorker from './registerServiceWorker';

const store = createStore(Store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') // eslint-disable-line
);
// registerServiceWorker();
