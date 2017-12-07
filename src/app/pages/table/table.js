import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
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
      <div className="full-w flex start table-container">
        <Link to="/caixa">Voltar</Link>
        <div
          className="table-item flex-column"
        >
          Mesa { this.getTable().table }
        </div>
        <div className="flex-column table-details">
          <div className="flex start space-between">
            <h2 className="table-details--title">Fechamento de conta</h2>
            <div className="flex-column end">
              <h2>Mesa { this.getTable().table }</h2>
              <h2>Hora: { moment().format('HH:mm') }</h2>
            </div>
          </div>
          <div className="table-details--content full-w">
            {
              !Object.keys(this.getTable()).length ? null : this.getTable().menuItems.map(i => (
                <div className="flex full-w table-details--item">
                  {i.menuItem}
                </div>
              ))
            }
          </div>
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
