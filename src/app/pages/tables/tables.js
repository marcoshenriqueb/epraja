import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './tables.styl';

import actions from './../../store/actions';

const { fetchBills: fetchBillsAction, resetBills: resetBillsAction } = actions;

class Table extends React.Component {
  componentDidMount() {
    this.props.fetchBills();
  }

  componentWillUnmount() {
    this.props.resetBills();
  }

  render() {
    return (
      <div className="full-w flex wrap tables-container">
        {
          this.props.bills.data.map(o => (
            <div key={o.table} className={`tables-item flex-column ${o.status}`}>Mesa { o.table }</div>
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
  resetBills: PropTypes.func.isRequired,
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
    resetBills: () => (
      dispatch(resetBillsAction())
    ),
  }
))(Table);

export default TableConnector;
