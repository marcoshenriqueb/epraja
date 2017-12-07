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
  fetchMenuItems: fetchMenuItemsAction,
  resetMenuItems: resetMenuItemsAction,
} = actions;

class Table extends React.Component {
  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchBillStatuses();
    this.props.fetchMenuItems();
  }

  componentWillUnmount() {
    this.props.resetBills();
    this.props.resetBillStatuses();
    this.props.resetMenuItems();
  }

  getStatusName(id) {
    const result = this.props.billStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  getTable() {
    const result = this.props.bills.data.filter(b => b._id === this.props.match.params.id);

    return result.length ? result[0] : {};
  }

  getItem(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0] : {};
  }

  getTotal() {
    if (!this.props.bills.data.length) return 0;
    if (!this.props.menuItems.data.length) return 0;

    let total = 0;
    const items = this.getTable().menuItems;
    items.forEach((i) => {
      total += (this.getItem(i.menuItem).price * i.quantity);
    });

    return total;
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
              !Object.keys(this.getTable()).length ? null : this.getTable().menuItems
              .map(i => (
                <div className="flex space-between full-w table-details--item">
                  <span>{i.quantity}</span>
                  <span>{this.getItem(i.menuItem).name}</span>
                  <span>R$ {this.getItem(i.menuItem).price}</span>
                </div>
              ))
            }
          </div>
          <div className="flex space-between full-w">
            <span>Total:</span>
            <span>R$ {this.getTotal()}</span>
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
    data: PropTypes.arrayOf(PropTypes.shape({
      menuItems: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired).isRequired,
  }).isRequired,
  billStatuses: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  menuItems: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchBillStatuses: PropTypes.func.isRequired,
  resetBillStatuses: PropTypes.func.isRequired,
  fetchMenuItems: PropTypes.func.isRequired,
  resetMenuItems: PropTypes.func.isRequired,
};

const TableConnector = connect(state => (
  {
    bills: state.bill.bills,
    billStatuses: state.billStatus.billStatuses,
    menuItems: state.menuItem.menuItems,
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
    fetchMenuItems: () => (
      dispatch(fetchMenuItemsAction())
    ),
    resetMenuItems: () => (
      dispatch(resetMenuItemsAction())
    ),
  }
))(Table);

export default TableConnector;
