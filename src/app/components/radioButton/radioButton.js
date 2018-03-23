import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './radioButton.styl';

class RadioButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: ['radio', 'radio', 'radio'],
    };
  }

  chengeButtonType() {
    const activeButton = [];
    this.props.checked.forEach((i) => {
      if (i) {
        activeButton.push('secondary');
      } else {
        activeButton.push('radio');
      }
    });
    this.setState({
      active: activeButton,
    });
  }

  render() {
    return (
      <div className="full-w flex">
        {
          this.props.statuses.map((s, k) => (
            <Button
              onClick={this.props.onChange(s._id)}
              key={s._id}
              text={s.name}
              type={this.state.active[k]}
              size=""
            />
          ))
        }
      </div>
    );
  }
}

RadioButton.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  checked: PropTypes.arrayOf(PropTypes.bool).isRequired,
  onChange: PropTypes.func,
};

RadioButton.defaultProps = {
  onChange: () => {},
};

export default RadioButton;
