import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Login from './pages/login/login';

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

/* eslint-disable jsx-a11y/anchor-is-valid */
const App = () => (
  <Router>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
    </div>
  </Router>
);
/* eslint-enable jsx-a11y/anchor-is-valid */

export default App;
