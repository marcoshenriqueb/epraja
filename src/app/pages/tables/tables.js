import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './tables.styl';

import actions from './../../store/actions';

const { fetchBills: fetchBillsAction } = actions;

class Table extends React.Component {
  componentDidMount() {
    this.props.fetchBills();
  }

  render() {
    return (
      <div className="full-w flex justify-center">
        {
          this.props.bills.data.map(o => (
            <span>{ o.table }</span>
          ))
        }
      </div>
    );
  }
}

Table.propTypes = {
  bills: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
};

const TableConnector = connect(state => (
  {
    bills: state.bill.bills,
  }
), dispatch => (
  {
    fetchBills: () => (
      dispatch(fetchBillsAction())
    ),
  }
))(Table);

export default TableConnector;
