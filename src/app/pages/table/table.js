import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import './table.styl';

import TableComponent from './../../components/table/table';
import actions from './../../store/actions';
import Button from './../../components/button/button';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchBillStatuses: fetchBillStatusesAction,
  resetBillStatuses: resetBillStatusesAction,
  fetchMenuItems: fetchMenuItemsAction,
  resetMenuItems: resetMenuItemsAction,
} = actions;

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'detalhada',
    };
  }

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

  getButtonType(button) {
    if (button === this.state.filter) {
      return 'secondary';
    }
    return '';
  }

  getTotal() {
    if (!this.props.bills.data.length) return 0;
    if (!this.props.menuItems.data.length) return 0;

    let total = 0;
    const items = this.getTable().menuItems;
    items.forEach((i) => {
      total += (this.getItem(i.menuItem).price);
    });
    return total;
  }

  mountData() {
    if (!Object.keys(this.getTable()).length) return [];
    const items = [];
    const tableItems = [...this.getTable().menuItems];
    if (this.state.filter === 'detalhada') {
      tableItems.forEach((i, k) => {
        items.push(Object.assign({}, i, {
          ordered: k + 1,
          menuItem: this.getItem(i.menuItem).name,
          price: this.getItem(i.menuItem).price,
          quantity: 1,
          totalPrice: '-',
        }));
      });
    } else {
      const itemsType = [];
      const itemsQty = [];
      tableItems.forEach((i) => {
        if (!itemsType.includes(this.getItem(i.menuItem)._id)) {
          itemsType.push(i.menuItem);
          itemsQty.push(1);
        } else {
          itemsQty[itemsType.indexOf(i.menuItem)] += 1;
        }
      });
      itemsType.forEach((i, k) => {
        items.push(Object.assign({}, i, {
          ordered: k + 1,
          menuItem: this.getItem(i).name,
          price: this.getItem(i).price,
          quantity: itemsQty[k],
          totalPrice: itemsQty[k] * this.getItem(i).price,
        }));
      });
    }
    return items;
  }

  render() {
    const titlesKeys = ['ordered', 'menuItem', 'quantity', 'price', 'totalPrice'];
    const titlesValues = ['Pedido Entregue', 'Nome', 'Qtde', 'Preço Unitário', 'Preço Total'];
    return (
      <div className="full-w flex start table-container">
        <div
          className="table-filter flex-column"
        >
          <Button
            text="Agrupada"
            classes="margin-bottom"
            type={`${this.getButtonType('agrupada')}`}
            onClick={() => this.setState({ filter: 'agrupada' })}
          />
          <div />
          <Button
            text="Detalhada"
            type={`${this.getButtonType('detalhada')}`}
            onClick={() => this.setState({ filter: 'detalhada' })}
          />
        </div>
        <div className="flex-column table-details">
          <div className="flex-column stretch">
            <div className="flex start table-details--header space-between">
              <h2 className="table-details--title">Fechamento de conta { moment().format('HH:mm') }</h2>
              <div className="table-details--number flex-column justify-center">
                <h2 className="table-details--numbertext">Mesa</h2>
                <h2 className="table-details--numbertext">{ this.getTable().table }</h2>
              </div>
            </div>
            <div className="table-details--content full-w">
              <TableComponent
                titlesKeys={titlesKeys}
                titlesValues={titlesValues}
                data={this.mountData()}
                blankRows
              />
            </div>
          </div>
          <div className="table-details--footer flex-column end full-w">
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
