import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Auth from './layouts/auth/auth';

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = () => (
  (
    <Router>
      <div>
        <Route path="/" component={Auth} />
      </div>
    </Router>
  )
);
/* eslint-enable jsx-a11y/anchor-is-valid */

export default App;
