import React from 'react';
import PropTypes from 'prop-types';

import Button from './../../components/button/button';

import './checkbox.styl';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
      icon: '',
    };
  }

  toggleCheckboxChange() {
    if (this.state.isChecked) {
      this.setState({ icon: '', isChecked: false });
    } else {
      this.setState({ icon: 'X', isChecked: true });
    }
    this.props.onChange(this.props.label);
  }

  render() {
    return (
      <Button
        text={this.state.icon}
        onClick={() => this.toggleCheckboxChange()}
        type="checkbox"
        size="checkbox"
      />
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

Checkbox.defaultProps = {
  checked: null,
}

export default Checkbox;
