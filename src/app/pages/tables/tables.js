import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './tables.styl';

import actions from './../../store/actions';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchBillStatuses: fetchBillStatusesAction,
  resetBillStatuses: resetBillStatusesAction,
} = actions;

class Table extends React.Component {
  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchBillStatuses();
  }

  componentWillUnmount() {
    this.props.resetBills();
    this.props.resetBillStatuses();
  }

  getStatusName(id) {
    const result = this.props.billStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  render() {
    return (
      <div className="full-w flex wrap tables-container">
        {
          this.props.bills.data.map(o => (
            <div
              key={o.table}
              className={`tables-item flex-column ${this.getStatusName(o.billStatus)}`}
            >
              Mesa { o.table }
            </div>
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
  billStatuses: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchBillStatuses: PropTypes.func.isRequired,
  resetBillStatuses: PropTypes.func.isRequired,
};

const TableConnector = connect(state => (
  {
    bills: state.bill.bills,
    billStatuses: state.billStatus.billStatuses,
  }
), dispatch => (
  {
    fetchBills: () => (
      dispatch(fetchBillsAction())
    ),
    resetBills: () => (
      dispatch(resetBillsAction())
    ),
    fetchBillStatuses: () => (
      dispatch(fetchBillStatusesAction())
    ),
    resetBillStatuses: () => (
      dispatch(resetBillStatusesAction())
    ),
  }
))(Table);

export default TableConnector;
