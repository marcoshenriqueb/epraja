import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import TextInput from './../../components/textInput/textInput';
import Button from './../../components/button/button';
import WhiteCircle from './../../../assets/images/whiteCircle.png';
import ArrowLeft from './../../../assets/images/arrow.png';
import ArrowRight from './../../../assets/images/arrowRight.png';

import './tablePicker.styl';

class TablePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderPage: 0,
      sliderTransform: 'translateX(0)',
    };

    this.slide = this.slide.bind(this);
  }

  getTableClass(table) {
    return this.props.activeBills.indexOf(table) < 0 ? 'terciary' : 'primary';
  }

  slide(right = true) {
    return () => {
      const page = right ? this.state.sliderPage + 1 : this.state.sliderPage - 1;
      const size = this.picker.clientWidth;
      const containerSize = this.sliderContainer.clientWidth;
      const visiblePickers = Math.floor(containerSize / size);
      const pageLimit = this.props.bills.length - visiblePickers;
      if (page <= pageLimit && page >= 0) {
        this.setState({
          sliderPage: page,
          sliderTransform: `translateX(-${(size + 2) * page}px)`,
        });
      }
    };
  }

  render() {
    return (
      <div className="full-w flex space-between table-picker--wrapper">
        <TextInput
          placeholder="buscar"
          type="number"
          name="search"
          value={this.props.searchValue}
          onChange={this.props.onSearchChange}
        />
        <div className="flex space-between table-picker--container">
          <div onClick={this.slide(false)} className="table-picker--arrows flex">
            <img alt="arrowLeft" src={ArrowLeft} />
          </div>
          <div className="flex table-picker--content">
            <div
              className="table-picker table-picker--first flex justify-center"
              ref={(picker) => { this.picker = picker; }}
              onClick={this.props.toggleAllBills}
            >
              <img src={WhiteCircle} alt="selectAll" />
            </div>
            <div
              className="table-picker--slider-container"
              ref={(sliderContainer) => { this.sliderContainer = sliderContainer; }}
            >
              <div
                className="flex table-picker--slider"
                ref={(slider) => { this.slider = slider; }}
                style={{ transform: this.state.sliderTransform }}
              >
                {
                  this.props.bills.map(b => (
                    <div
                      className={`table-picker ${this.getTableClass(b.table)} flex justify-center`}
                      key={b._id}
                      onClick={this.props.toggleBill(b.table)}
                    >
                      {b.table}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div onClick={this.slide()} className="table-picker--arrows flex">
            <img alt="arrowRight" src={ArrowRight} />
          </div>
        </div>
        <Link to="/relatorios"><Button onClick={() => {}} text="Relatórios" type="primary" /></Link>
      </div>
    );
  }
}

TablePicker.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  bills: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    table: PropTypes.number.isRequired,
  })).isRequired,
  activeBills: PropTypes.arrayOf(PropTypes.number).isRequired,
  toggleAllBills: PropTypes.func.isRequired,
  toggleBill: PropTypes.func.isRequired,
};

export default TablePicker;
