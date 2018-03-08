import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import TextInput from './../../components/textInput/textInput';
import Button from './../../components/button/button';

import './tablePicker.styl';

class TablePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slidePage: 0,
    };

    this.slide = this.slide.bind(this);
  }

  slide() {
    const page = this.state.slidePage + 1;
    const size = this.picker.clientWidth;
    console.log(`translateX(-${(size + 2) * page}px)`);
    this.slider.style.transform = `translateX(-${(size + 2) * page}px)`;
    this.setState({
      slidePage: page,
    });
  }

  render() {
    return (
      <div className="full-w flex space-between">
        <TextInput
          placeholder="buscar"
          type="number"
          name="search"
          value={this.props.searchValue}
          onChange={this.props.onSearchChange}
        />
        <div className="flex space-between table-picker--container">
          <div className="table-picker--arrows flex"><span>&#8592;</span></div>
          <div className="flex table-picker--content">
            <div
              className="table-picker table-picker--first flex justify-center"
              ref={(picker) => { this.picker = picker; }}
            >
              o
            </div>
            <div className="table-picker--slider-container">
              <div
                className="flex table-picker--slider"
                ref={(slider) => { this.slider = slider; }}
              >
                {
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(t => (
                    <div className="table-picker terciary flex justify-center">
                      {t}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div onClick={this.slide} className="table-picker--arrows flex"><span>&#8594;</span></div>
        </div>
        <Link to="/relatorios"><Button onClick={() => {}} text="Relatórios" type="primary" /></Link>
      </div>
    );
  }
}

TablePicker.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default TablePicker;
