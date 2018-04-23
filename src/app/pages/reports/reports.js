import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

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
      type: 0,
      startDate: null,
      endDate: null,
      focusedInput: null,
    };

    this.toggleItemFilters = this.toggleItemFilters.bind(this);
    this.toggleTables = this.toggleTables.bind(this);
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

  getAllCategoryNames() {
    return this.props.menuCategories.data.map(c => c.name);
  }

  getAllCategoryItems(category) {
    return this.props.menuItems.data.filter(i => (
      this.getCategoryName(i.menuCategory) === category.toLowerCase()
    ));
  }

  getAllTables() {
    const tables = [];
    this.props.bills.data.forEach((b) => {
      if (tables.includes(b.table)) return;
      tables.push(b.table);
    });

    return tables;
  }

  toggleItemFilters(filter) {
    const newItems = [...this.state.itemFilters];

    if (this.getAllCategoryNames().includes(filter)) {
      if (this.getAllCategoryItems(filter).some(i => newItems.includes(i._id))) {
        this.getAllCategoryItems(filter).forEach((i) => {
          if (newItems.includes(i._id)) {
            newItems.splice(newItems.indexOf(i._id), 1);
          }
        });
      } else {
        this.getAllCategoryItems(filter).forEach((i) => {
          newItems.push(i._id);
        });
      }
    }

    if (newItems.includes(filter)) {
      newItems.splice(newItems.indexOf(filter), 1);
    } else {
      newItems.push(filter);
    }
    this.setState({ itemFilters: newItems });
  }

  toggleTables(table) {
    const newTables = [...this.state.tables];

    if (table === 'todasmesas' && !newTables.length) {
      this.setState({ tables: this.getAllTables() });
      return;
    } else if (table === 'todasmesas' && newTables.length) {
      this.setState({ tables: [] });
      return;
    }

    if (newTables.includes(Number(table))) {
      newTables.splice(newTables.indexOf(table), 1);
    } else {
      newTables.push(Number(table));
    }
    this.setState({ tables: newTables });
  }

  render() {
    return (
      <div className="full-w flex-column start wrap reports-container">
        <div className="flex reports-header full-w space-between">
          <h1>Relatórios</h1>
          <DateRangePicker
            required
            showClearDates
            showDefaultInputIcon
            hideKeyboardShortcutsPanel
            displayFormat="DD/MM/YYYY"
            initialVisibleMonth={() => moment().subtract(1, 'month')}
            monthFormat="MM/YYYY"
            isOutsideRange={d => d > moment()}
            startDatePlaceholderText="de"
            endDatePlaceholderText="até"
            startDate={this.state.startDate}
            startDateId="reports-start-date"
            endDate={this.state.endDate}
            endDateId="reports-end-date"
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
          <div colSpan={1} />
        </div>
        <div className="flex start full-w">
          <div className="grow-1 reports-filter">
            <table className="full-w table-paddingTop table-noSeparator">
              <thead>
                <tr>
                  <th className="table-header">Mesas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row">
                  <td className="table-cell table--cell-equalWidth table--cell-tableNumber">
                    Todos
                  </td>
                  <td className="table-cell table--cell-equalWidth">
                    <Checkbox
                      label="todasmesas"
                      onChange={this.toggleTables}
                      checked={this.getAllTables().length === this.state.tables.length}
                    />
                  </td>
                </tr>
                {
                  this.props.bills.data.map(i => (
                    <tr className="table-row" key={`${i.table}_${i._id}`}>
                      <td className="table-cell table--cell-equalWidth table--cell-tableNumber">
                        {i.table}
                      </td>
                      <td className="table-cell table--cell-equalWidth">
                        <Checkbox
                          label={`${i.table}`}
                          onChange={this.toggleTables}
                          checked={this.state.tables.includes(i.table)}
                        />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          {
            this.props.menuCategories.data.map(c => (
              <div className="grow-1 reports-filter" key={c.name}>
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
                          label={c.name}
                          onChange={this.toggleItemFilters}
                          checked={
                            this.getAllCategoryItems(c.name)
                            .every(i => this.state.itemFilters.includes(i._id))
                          }
                        />
                      </td>
                    </tr>
                    {
                      this.props.menuItems.data.filter(o => o.menuCategory === c._id).map(i => (
                        <tr className="table-row" key={i.name}>
                          <td className="table-cell table--cell-75Width">
                            {this.getItemName(i._id)}
                          </td>
                          <td className="table-cell table--cell-25Width">
                            <Checkbox
                              label={i._id}
                              onChange={this.toggleItemFilters}
                              checked={this.state.itemFilters.includes(i._id)}
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
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
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                  FATURADO
                </td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="faturado"
                    checked={this.state.type === 0}
                    onChange={() => this.setState({ type: 0 })}
                  />
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                  PEDIDOS CANCELADOS
                </td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="cancelados"
                    checked={this.state.type === 1}
                    onChange={() => this.setState({ type: 1 })}
                  />
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                  TEMPO DE ATENDIMENTO
                </td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="tempo"
                    checked={this.state.type === 2}
                    onChange={() => this.setState({ type: 2 })}
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
