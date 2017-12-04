import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';

import 'normalize.css';
import store from './app/store';
import './assets/stylus/index.styl';
import App from './app/App';
// import registerServiceWorker from './registerServiceWorker';

const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root') // eslint-disable-line
);
// registerServiceWorker();
