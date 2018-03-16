import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './items.styl';

import TablePicker from './../../components/tablePicker/tablePicker';
import ItemsFilters from './../../components/itemsFilters/itemsFilters';
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
      activeFilters: [...this.getCategories(), ...this.getStatuses()],
      searchValue: '',
      activeBills: [],
    };

    this.getFilterClass = this.getFilterClass.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.toggleAllBills = this.toggleAllBills.bind(this);
    this.toggleBill = this.toggleBill.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchBills(),
      this.props.fetchBillStatuses(),
      this.props.fetchMenuItems(),
      this.props.fetchMenuItemStatuses(),
      this.props.fetchMenuCategories(),
    ]).then(() => {
      this.populateActiveBills();
    });
  }

  componentWillUnmount() {
    this.props.resetBills();
    this.props.resetBillStatuses();
    this.props.resetMenuItems();
    this.props.resetMenuItemStatuses();
    this.props.resetMenuCategories();
  }

  onSearchChange(e) {
    const result = this.getAllAvailableTables().filter(t => t.toString() === e.target.value);
    this.setState({
      searchValue: e.target.value,
      activeBills: result,
    });
  }

  getItemStatus(id) {
    const result = this.props.menuItemStatuses.data.filter(s => s._id === id);

    return result.length ? result[0] : {};
  }

  getItemStatusName(id) {
    const result = this.props.menuItemStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
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
          const itemStatus = this.getItemStatusName(i.itemStatus);
          const itemCategory = this.getCategory(this.getItem(i.menuItem).menuCategory);
          if (
            this.state.activeFilters.includes(itemStatus)
            &&
            this.state.activeFilters.includes(itemCategory)
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

  getStatuses() {
    return [...this.props.menuItemStatuses.data.map(s => s.name.toLowerCase())];
  }

  getCategories() {
    return [...this.props.menuCategories.data.map(c => c.name.toLowerCase())];
  }

  getFilterClass(f) {
    if (this.state.activeFilters.indexOf(f) < 0) {
      return '';
    }
    return 'secondary';
  }

  getAllAvailableTables() {
    const activeBills = [];
    this.props.bills.data.forEach((b) => {
      if (activeBills.indexOf(b.table) < 0) {
        activeBills.push(b.table);
      }
    });
    return activeBills;
  }

  populateActiveBills() {
    this.setState({
      activeBills: this.getAllAvailableTables().sort(),
    });
  }

  changeFilter(e) {
    const activeFilters = [...this.state.activeFilters];
    if (activeFilters.indexOf(e.toLowerCase()) > -1) {
      const index = activeFilters.indexOf(e.toLowerCase());
      if (index !== -1) {
        activeFilters.splice(index, 1);
        this.setState({
          activeFilters: [...activeFilters],
        });
      }
    } else {
      activeFilters.push(e.toLowerCase());
      this.setState({
        activeFilters: [...activeFilters],
      });
    }
  }

  updateStatus(id, statusId) {
    return () => {
      this.props.updateBillItemStatus(id, statusId);
    };
  }

  toggleAllBills() {
    if (this.state.activeBills.length < this.getAllAvailableTables().length) {
      this.populateActiveBills();
    } else {
      this.setState({
        activeBills: [],
      });
    }
  }

  toggleBill(table) {
    return () => {
      const index = this.state.activeBills.indexOf(table);
      const activeBills = [...this.state.activeBills];
      if (index < 0) {
        activeBills.push(table);
        this.setState({
          activeBills,
        });
      } else {
        activeBills.splice(index, 1);
        this.setState({
          activeBills,
        });
      }
    };
  }

  render() {
    return (
      <div className="full-w flex-column start items-container">
        <TablePicker
          searchValue={this.state.searchValue}
          onSearchChange={this.onSearchChange}
          bills={this.props.bills.data}
          activeBills={this.state.activeBills}
          toggleAllBills={this.toggleAllBills}
          toggleBill={this.toggleBill}
        />
        <ItemsFilters
          getFilterClass={this.getFilterClass}
          categories={this.getCategories()}
          statuses={this.getStatuses()}
          changeFilter={this.changeFilter}
          activeFilters={this.state.activeFilters}
        />
        <div className="full-w flex-column">
          <table>
            <thead>
              <tr>
                <th>Ordem/Hora</th>
                <th>Mesa</th>
                <th>Nome do Prato</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                this.getItems().map((i, k) => (
                  <tr key={i._id}>
                    <th className="space-between">
                      {k + 1}
                      <div>&nbsp;</div>
                    </th>
                    <th className="">
                      {i.table}
                      <div>&nbsp;</div>
                    </th>
                    <th className="">
                      {i.menuItem.name}
                      <div>&nbsp;</div>
                    </th>
                    <th className="flex items--table--statuses">
                      {
                        this.props.menuItemStatuses.data.map(s => (
                          <span className={i.status.name === s.name ? `${s.name}` : ''} key={s._id}>
                            <input
                              onChange={this.updateStatus(i._id, s._id)}
                              type="radio"
                              name={`status-${i._id}`}
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
