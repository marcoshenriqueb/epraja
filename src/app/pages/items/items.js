import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './items.styl';

import TablePicker from './../../components/tablePicker/tablePicker';
import RadioButton from './../../components/radioButton/radioButton';
import ItemsFilters from './../../components/itemsFilters/itemsFilters';
import Table from './../../components/table/table';
import actions from './../../store/actions';
import TrashIcon from './../../../assets/images/trashIcon.png';
import BillOpenIcon from './../../../assets/images/billOpen.png';
import BillClosedIcon from './../../../assets/images/billClosed.png';
import XIcon from './../../../assets/images/x.png';
import ArrowDown from './../../../assets/images/arrowDown.png';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchBillStatuses: fetchBillStatusesAction,
  fetchMenuItems: fetchMenuItemsAction,
  fetchMenuItemStatuses: fetchMenuItemStatusesAction,
  fetchMenuCategories: fetchMenuCategoriesAction,
  updateBillItemStatus: updateBillItemStatusAction,
} = actions;

class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilters: [],
      searchValue: '',
      activeBills: [],
      expandedComment: '',
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
      this.setState({
        activeFilters: [...this.getCategories(), ...this.getStatuses(), 'fechada', 'aberta'],
      });
    });
  }

  componentWillUnmount() {
    this.props.resetBills();
  }

  onSearchChange(e) {
    const result = this.getAllAvailableTables().filter(t => t.toString() === e.target.value);
    this.setState({
      searchValue: e.target.value,
      activeBills: result,
    });
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
      b.menuItems.forEach((i, k) => {
        const itemStatus = this.getItemStatusName(i.itemStatus);
        const itemCategory = this.getCategory(this.getItem(i.menuItem).menuCategory);
        const billStatus = this.getStatusName(b.billStatus);
        if (
          this.state.activeFilters.includes(itemStatus)
          &&
          this.state.activeFilters.includes(itemCategory)
          &&
          this.state.activeFilters.includes(billStatus)
          &&
          this.state.activeBills.includes(b.table)
          &&
          i.canceled === false
        ) {
          items.push(Object.assign({}, i, {
            delete: (
              <Link
                to={`/cancelamento/${b._id}/${i.menuItem}/${i._id}`}
              >
                <img src={TrashIcon} alt="Trash" />
              </Link>
            ),
            menuItem: this.getItem(i.menuItem).name,
            table: b.table,
            comment: this.getCommentComponent(i),
            status: this.getStatusCellComponent(i),
            order: (
              <div className="flex space-between">
                <p>
                  {k + 1}
                </p>
                <div className="table--cell--whiteSpace" />
                <p>
                  {
                    this.getStatusName(i.deliveredAt) === undefined ?
                      moment.duration(moment().diff(moment(i.createdAt)))
                        .format('HH:mm', { trim: false }) :
                    moment.duration(moment(i.deliveredAt).diff(moment(i.createdAt)))
                      .format('HH:mm', { trim: false })
                  }
                </p>
              </div>
            ),
            billStatus: this.getBillStatusComponent(b.billStatus, b._id),
          }));
        }
      });
    });

    return items;
  }

  getCommentComponent(item) {
    return (
      <div className="table--cell--comment">
        {
          item.comment.length > 22 ?
            <div className="table--cell--positionRelative flex space-between">
              <p className="table--cell--text">
                {item.comment}
              </p>
              <span
                onClick={() => this.setState({ expandedComment: item._id })}
                className="table--cell--arrowIcon"
              >
                <img alt="arrowDown" src={ArrowDown} />
              </span>
              {
                this.state.expandedComment === item._id ?
                  <div className="table--modal--expanded">
                    <span
                      onClick={() => this.setState({ expandedComment: '' })}
                      className="flex-column end"
                    >
                      <img alt="X" src={XIcon} />
                    </span>
                    <p className="table--modal--text">
                      {item.comment}
                    </p>
                  </div> :
                  null
              }
            </div> :
            item.comment
        }
      </div>
    );
  }

  getStatusCellComponent(item) {
    const classes = [];
    this.props.menuItemStatuses.data.map(s => (item.itemStatus === s._id)).forEach((i) => {
      if (i) {
        classes.push('secondary');
      } else {
        classes.push('radio');
      }
    });
    return (
      <RadioButton
        options={this.props.menuItemStatuses.data}
        checked={classes}
        updateBillItemStatus={(selected) => {
          this.props.updateBillItemStatus(item._id, selected);
        }}
        item={item._id}
      />
    );
  }

  getBillStatusComponent(status, id) {
    if (this.getStatusName(status) === 'aberta') return <img src={BillOpenIcon} alt="BillOpen" />;
    return (
      <Link
        to={`/caixa/${id}`}
        className="table--billStatus--cell"
      >
        <img src={BillClosedIcon} alt="BillClosed" />
      </Link>
    );
  }

  getStatuses() {
    return [...this.props.menuItemStatuses.data.map(s => s.name.toLowerCase())];
  }

  getCategories() {
    return [...this.props.menuCategories.data.map(c => c.name.toLowerCase())];
  }

  getFilterClass(f) {
    if (f !== 'aberta' && this.state.activeFilters.indexOf(f) > -1) {
      return 'secondary';
    } else if (f === 'aberta' && this.state.activeFilters.indexOf(f) < 0) {
      return 'secondary';
    }
    return '';
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
    const titlesKeys = ['delete', 'order', 'table', 'menuItem', 'comment', 'status', 'billStatus'];
    const titlesValues = [null, 'Ordem/Hora', 'Mesa', 'Nome do Prato', 'Comentário', 'Status', 'Conta'];
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
        <Table
          titlesKeys={titlesKeys}
          titlesValues={titlesValues}
          data={this.getItems()}
          blankRows
        />
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
  fetchMenuItems: PropTypes.func.isRequired,
  fetchMenuItemStatuses: PropTypes.func.isRequired,
  fetchMenuCategories: PropTypes.func.isRequired,
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
    fetchMenuItems: () => (
      dispatch(fetchMenuItemsAction())
    ),
    fetchMenuItemStatuses: () => (
      dispatch(fetchMenuItemStatusesAction())
    ),
    fetchMenuCategories: () => (
      dispatch(fetchMenuCategoriesAction())
    ),
    updateBillItemStatus: (id, statusId) => (
      dispatch(updateBillItemStatusAction(id, statusId))
    ),
  }
))(Items);

export default ItemsConnector;
