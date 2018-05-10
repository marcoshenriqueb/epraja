import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: null,
    };
  }

  componentDidMount() {
    this.tick();
    this.timer = setInterval(this.tick.bind(this), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const counter = moment.duration(moment().diff(moment(this.props.date)))
      .format('HH:mm', { trim: true });
    this.setState({ counter });
  }

  render() {
    return <p>{this.state.counter}</p>;
  }
}

Timer.propTypes = {
  date: PropTypes.string.isRequired,
};

export default Timer;
