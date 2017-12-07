import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './table.styl';

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

  getTable() {
    const result = this.props.bills.data.filter(b => b._id === this.props.match.params.id);

    return result.length ? result[0] : {};
  }

  render() {
    return (
      <div className="full-w flex wrap">
        <div
          className="tables-item flex-column"
        >
          Mesa { this.getTable().table }
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
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
    fetchBills: query => (
      dispatch(fetchBillsAction(query))
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
