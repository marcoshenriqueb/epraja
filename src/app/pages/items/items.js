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
  fetchMenuCategories: fetchMenuCategoriesAction,
  resetMenuCategories: resetMenuCategoriesAction,
  updateBillItemStatus: updateBillItemStatusAction,
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
    this.props.fetchMenuCategories();
  }

  componentWillUnmount() {
    this.props.resetBills();
    this.props.resetBillStatuses();
    this.props.resetMenuItems();
    this.props.resetMenuItemStatuses();
    this.props.resetMenuCategories();
  }

  getItemStatus(id) {
    const result = this.props.menuItemStatuses.data.filter(s => s._id === id);

    return result.length ? result[0] : {};
  }

  getStatusName(id) {
    const result = this.props.billStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  getCategory(id) {
    const result = this.props.menuCategories.data.filter(c => c._id === id);

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
          if (
            this.state.category === 'geral' ||
            this.state.category === this.getCategory(this.getItem(i.menuItem).menuCategory)
          ) {
            items.push(Object.assign({}, i, {
              menuItem: this.getItem(i.menuItem),
              table: b.table,
              status: this.getItemStatus(i.itemStatus),
            }));
          }
        });
      }
    });

    return items;
  }

  getCategories() {
    return ['geral', ...this.props.menuCategories.data.map(c => c.name)];
  }

  changeCategory(e) {
    this.setState({
      category: e.target.innerHTML.toLowerCase(),
    });
  }

  updateStatus(id, statusId) {
    return () => {
      this.props.updateBillItemStatus(id, statusId);
    };
  }

  render() {
    return (
      <div className="full-w flex-column start items-container">
        <div className="flex justify-center full-w items--categories">
          {
            this.getCategories().map(c => (
              <span
                key={c}
                onClick={this.changeCategory}
                className={`button-o ${this.state.category === c.toLowerCase() ? 'active' : ''}`}
              >
                {c.toLowerCase()}
              </span>
            ))
          }
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
                      {
                        this.props.menuItemStatuses.data.map(s => (
                          <span className={i.status.name === s.name ? `${s.name}` : ''}>
                            <input
                              onClick={this.updateStatus(i._id, s._id)}
                              type="radio"
                              checked={i.status.name === s.name}
                            />
                            &nbsp;&nbsp;{s.name}
                          </span>
                        ))
                      }
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
  menuCategories: PropTypes.shape({
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
  fetchMenuCategories: PropTypes.func.isRequired,
  resetMenuCategories: PropTypes.func.isRequired,
  updateBillItemStatus: PropTypes.func.isRequired,
};

const ItemsConnector = connect(state => (
  {
    bills: state.bill.bills,
    billStatuses: state.billStatus.billStatuses,
    menuItems: state.menuItem.menuItems,
    menuItemStatuses: state.menuItemStatus.menuItemStatuses,
    menuCategories: state.menuCategory.menuCategories,
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
    fetchMenuCategories: () => (
      dispatch(fetchMenuCategoriesAction())
    ),
    resetMenuCategories: () => (
      dispatch(resetMenuCategoriesAction())
    ),
    updateBillItemStatus: (id, statusId) => (
      dispatch(updateBillItemStatusAction(id, statusId))
    ),
  }
))(Items);

export default ItemsConnector;
