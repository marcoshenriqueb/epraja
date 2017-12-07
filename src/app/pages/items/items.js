import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './items.styl';

import actions from './../../store/actions';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchBillStatuses: fetchBillStatusesAction,
  resetBillStatuses: resetBillStatusesAction,
  fetchMenuItems: fetchMenuItemsAction,
  resetMenuItems: resetMenuItemsAction,
  fetchMenuItemStatuses: fetchMenuItemStatusesAction,
  resetMenuItemStatuses: resetMenuItemStatusesAction,
} = actions;

class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'geral',
    };

    this.changeCategory = this.changeCategory.bind(this);
  }

  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchBillStatuses();
    this.props.fetchMenuItems();
    this.props.fetchMenuItemStatuses();
  }

  componentWillUnmount() {
    this.props.resetBills();
    this.props.resetBillStatuses();
    this.props.resetMenuItems();
    this.props.resetMenuItemStatuses();
  }

  getItemStatus(id) {
    const result = this.props.menuItemStatuses.data.filter(s => s._id === id);

    return result.length ? result[0] : {};
  }

  getStatusName(id) {
    const result = this.props.billStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  getItem(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0] : {};
  }

  getItems() {
    if (!this.props.bills.data.length) return [];

    const items = [];
    this.props.bills.data.forEach((b) => {
      if (this.getStatusName(b.billStatus) !== 'fechada') {
        b.menuItems.forEach((i) => {
          items.push(Object.assign({}, i, {
            menuItem: this.getItem(i.menuItem),
            table: b.table,
            status: this.getItemStatus(i.itemStatus),
          }));
        });
      }
    });

    return items;
  }

  changeCategory(e) {
    this.setState({
      category: e.target.innerHTML.toLowerCase(),
    });
  }

  render() {
    return (
      <div className="full-w flex-column start items-container">
        <div className="flex justify-center full-w items--categories">
          <span onClick={this.changeCategory} className={`button-o ${this.state.category === 'comidas' ? 'active' : ''}`}>Comidas</span>
          <span onClick={this.changeCategory} className={`button-o ${this.state.category === 'bebidas' ? 'active' : ''}`}>Bebidas</span>
          <span onClick={this.changeCategory} className={`button-o ${this.state.category === 'geral' ? 'active' : ''}`}>Geral</span>
        </div>
        <div className="full-w flex-column">
          <table>
            <thead>
              <tr>
                <th>Ordem/Hora</th>
                <th>Quant.</th>
                <th>Nome do Prato</th>
                <th>Mesa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                this.getItems().map((i, k) => (
                  <tr key={i._id}>
                    <th>{k + 1}</th>
                    <th>{i.quantity}</th>
                    <th>{i.menuItem.name}</th>
                    <th>{i.table}</th>
                    <th className="flex items--table--statuses">
                      <span className={i.status.name === 'Entregue' ? 'green' : ''}>
                        <input type="radio" checked={i.status.name === 'Entregue'} />
                        &nbsp;&nbsp;Entregue
                      </span>
                      <span className={i.status.name === 'Encaminhado' ? 'blue' : ''}>
                        <input type="radio" checked={i.status.name === 'Encaminhado'} />
                        &nbsp;&nbsp;Encaminhado
                      </span>
                      <span className={i.status.name === 'Pendente' ? 'red' : ''}>
                        <input type="radio" checked={i.status.name === 'Pendente'} />
                        &nbsp;&nbsp;Pendente
                      </span>
                    </th>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Items.propTypes = {
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
  menuItemStatuses: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchBillStatuses: PropTypes.func.isRequired,
  resetBillStatuses: PropTypes.func.isRequired,
  fetchMenuItems: PropTypes.func.isRequired,
  resetMenuItems: PropTypes.func.isRequired,
  fetchMenuItemStatuses: PropTypes.func.isRequired,
  resetMenuItemStatuses: PropTypes.func.isRequired,
};

const ItemsConnector = connect(state => (
  {
    bills: state.bill.bills,
    billStatuses: state.billStatus.billStatuses,
    menuItems: state.menuItem.menuItems,
    menuItemStatuses: state.menuItemStatus.menuItemStatuses,
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
    fetchMenuItemStatuses: () => (
      dispatch(fetchMenuItemStatusesAction())
    ),
    resetMenuItemStatuses: () => (
      dispatch(resetMenuItemStatusesAction())
    ),
  }
))(Items);

export default ItemsConnector;
