import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './reports.styl';

import actions from './../../store/actions';
import Button from './../../components/button/button';
import Checkbox from './../../components/checkbox/checkbox';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchMenuItems: fetchMenuItemsAction,
  fetchMenuCategories: fetchMenuCategoriesAction,
} = actions;

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemFilters: [],
      tables: [],
      type: '',
    };

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchMenuItems();
    this.props.fetchMenuCategories();
  }

  componentWillUnmount() {
    this.props.resetBills();
  }

  getCategoryName(id) {
    const result = this.props.menuCategories.data.filter(c => c._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  getItemName(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0].name : {};
  }

  manageArray(array, item) {
    const newArray = [...array]
    if (newArray.includes(item)) {
      newArray.splice(item);
    } else {
      newArray.push(item);
    }
    return array;
  }

  toggleItemFilters(filter) {
    const newItems = this.manageArray(...this.state.itemFilters, filter);

    this.setState({ itemFilters: newItems });
  }

  toggleTables(table) {
    const newTables = this.manageArray(...this.state.tables, table);

    this.setState({ tables: newTables });
  }

  toggleType(type) {
    this.setState({ type: type });
  }

  render() {
    return (
      <div className="full-w flex-column start wrap reports-container">
        <div className="flex reports-header full-w">
          <h1>Relatórios</h1>
        </div>
        <div className="flex start reports-filters full-w space-between">
          <table className="table-paddingTop full-w table-noSeparator">
            <thead>
              <tr>
                <th className="table-header">Mesas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="table-cell table--cell-equalWidth table--cell-tableNumber">Todos</td>
                <td className="table-cell table--cell-equalWidth">
                  <Checkbox
                    label="todasmesas"
                    onChange={this.toggleTables}
                  />
                </td>
              </tr>
              {
                this.props.bills.data.map(i => (
                  <tr className="table-row">
                    <td className="table-cell table--cell-equalWidth table--cell-tableNumber">{i.table}</td>
                    <td className="table-cell table--cell-equalWidth">
                      <Checkbox
                        label={`${i.table}`}
                        onChange={this.toggleTables}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
            this.props.menuCategories.data.map(c => (
              <table className="full-w table-noSeparator">
                <thead>
                  <tr>
                    <th className="table-header" colSpan={2}>{this.getCategoryName(c._id)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="table-cell table--cell-75Width">Todos</td>
                    <td className="table-cell table--cell-25Width">
                      <Checkbox
                        label={`todas${c.name}`}
                        onChange={this.toggleItemFilters}
                      />
                    </td>
                  </tr>
                  {
                    this.props.menuItems.data.filter(o => o.menuCategory === c._id).map(i => (
                      <tr className="table-row">
                        <td className="table-cell table--cell-75Width">{this.getItemName(i._id)}</td>
                        <td className="table-cell table--cell-25Width">
                          <Checkbox
                            label={i._id}
                            onChange={this.toggleItemFilters}
                          />
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            ))
          }
        </div>
        <div className="flex reports-footer full-w space-between">
          <table className="table-paddingTop table-noSeparator">
            <thead>
              <tr>
                <th className="table-header--secondary">
                  <h2 className="table-header--secondaryTitle">Tipos de Relatório</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">FATURADO</td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="faturado"
                    onChange={this.toggleType}
                  />
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">PEDIDOS CANCELADOS</td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="cancelados"
                    onChange={this.toggleType}
                  />
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">TEMPO DE ATENDIMENTO</td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="tempo"
                    onChange={this.toggleType}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button
            text="OK"
            type="secondary"
            size="square"
          />
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  bills: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      menuItems: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired).isRequired,
  }).isRequired,
  menuItems: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  menuCategories: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchMenuItems: PropTypes.func.isRequired,
  fetchMenuCategories: PropTypes.func.isRequired,
};

const ReportsConnector = connect(state => (
  {
    bills: state.bill.bills,
    menuItems: state.menuItem.menuItems,
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
    fetchMenuItems: () => (
      dispatch(fetchMenuItemsAction())
    ),
    fetchMenuCategories: () => (
      dispatch(fetchMenuCategoriesAction())
    ),
  }
))(Reports);

export default ReportsConnector;
