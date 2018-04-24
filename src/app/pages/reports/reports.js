import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

import './reports.styl';

import arrowImg from './../../../assets/images/arrow.png';
import actions from './../../store/actions';
import Button from './../../components/button/button';
import Checkbox from './../../components/checkbox/checkbox';
import Report from './../../components/report/report';

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
      data: null,
    };
    this.toggleItemFilters = this.toggleItemFilters.bind(this);
    this.toggleTables = this.toggleTables.bind(this);
    this.generateReport = this.generateReport.bind(this);
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

  getItem(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0] : {};
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

  getBillItemsFromTableCategoryAndDate(table, category, date) {
    let result = [];

    this.props.bills.data.filter(b => (
      moment(b.createdAt).format('DD/MM/YYYY') === date
      &&
      b.table === table
    )).forEach((bill) => {
      const canceled = this.state.type === 1;

      result = [...bill.menuItems.filter(item => (
        this.getItem(item.menuItem).menuCategory === category._id
        &&
        this.state.itemFilters.includes(item.menuItem)
        &&
        item.canceled === canceled
      ))];
    });

    return result;
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

  mountReport() {
    const report = {
      data: [],
      titlesKeys: ['date', 'table'],
      titlesValues: ['DATA', 'MESA'],
      qty: 0,
      total: 0,
      date: `${this.state.startDate.format('DD/MM/YYYY')}
        até ${this.state.endDate.format('DD/MM/YYYY')}`,
    };
    this.props.menuCategories.data.forEach((c) => {
      report.titlesKeys.push(`${c.name}Qty`, `${c.name}Subtotal`);
      report.titlesValues.push(`${c.name.toUpperCase()}`, `R$ ${c.name.toUpperCase()}`);
      report[`${c.name}Qty`] = 0;
      report[`${c.name}Subtotal`] = 0;
    });
    report.titlesKeys.push('qty', 'total');
    report.titlesValues.push('TOTAL', 'R$ TOTAL');
    console.log(report);

    const j = this.state.endDate.clone();
    for (const i = this.state.startDate.clone(); i <= j; i.add(1, 'days')) {
      const day = {
        data: [],
        total: 0,
        qty: 0,
      };
      this.props.menuCategories.data.forEach((c) => {
        day[`${c.name}Qty`] = 0;
        day[`${c.name}Subtotal`] = 0;
      });
      this.state.tables.forEach((t) => {
        const row = {
          table: t,
          date: i.format('DD/MM/YYYY'),
          total: 0,
          qty: 0,
        };
        this.props.menuCategories.data.forEach((c) => {
          let qty = 0;
          let subTotal = 0;
          const items = this.getBillItemsFromTableCategoryAndDate(row.table, c, row.date);

          items.forEach((item) => {
            qty += 1;
            subTotal += this.getItem(item.menuItem).price;
          });

          row[`${c.name}Qty`] = qty;
          day[`${c.name}Qty`] += qty;
          report[`${c.name}Qty`] += qty;
          row.qty += qty;
          day.qty += qty;
          report.qty += qty;

          row[`${c.name}Subtotal`] = subTotal;
          day[`${c.name}Subtotal`] += subTotal;
          report[`${c.name}Subtotal`] += subTotal;
          row.total += subTotal;
          day.total += subTotal;
          report.total += subTotal;
        });
        if (row.total > 0) day.data.push(row);
      });
      if (day.data.length > 0) report.data.push(day);
    }
    if (report.data.length > 0) {
      this.setState({ data: report });
    }
  }

  generateReport() {
    if (
      this.state.startDate !== null
      &&
      this.state.endDate !== null
      &&
      this.state.tables.length
      &&
      this.state.itemFilters.length
    ) {
      this.mountReport();
    }
  }

  render() {
    if (this.state.data === null) {
      return (
        <div className="full-w flex-column start wrap reports-container">
          <div
            className="flex justify-center center div-back"
            onClick={() => this.props.history.goBack()}
          >
            <img src={arrowImg} alt="Voltar" />
            <h3 className="button-back">Voltar</h3>
          </div>
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
              minimumNights={0}
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
                              {this.getItem(i._id).name}
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
              </tbody>
            </table>
            <Button
              text="OK"
              type="secondary"
              size="square"
              onClick={this.generateReport}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="full-w flex-column start wrap reports-container">
        <div
          className="flex justify-center center div-back"
          onClick={() => this.setState({ data: null })}
        >
          <img src={arrowImg} alt="Voltar" />
          <h3 className="button-back">Voltar</h3>
        </div>
        <Report
          title={this.state.type === 0 ? 'Faturado' : 'Cancelados'}
          report={this.state.data}
        />
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
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
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
