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
      allItems: [],
      allTables: false,
      type: [false, false],
      startDate: null,
      endDate: null,
      focusedInput: null,
    };
    this.toggleItemFilters = this.toggleItemFilters.bind(this);
    this.toggleTables = this.toggleTables.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchBills(),
      this.props.fetchMenuItems(),
      this.props.fetchMenuCategories(),
    ]).then(() => {
      const categories = this.props.menuCategories.data.map(() => false);
      this.setState({ allItems: categories });
    });
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

  toggleItemFilters(filter) {
    const newItems = [...this.state.itemFilters];
    if (newItems.includes(filter)) {
      newItems.splice(filter);
    } else {
      newItems.push(filter);
    }
    this.setState({ itemFilters: newItems });
  }

  toggleTables(table) {
    const newTables = [...this.state.tables];
    if (newTables.includes(table)) {
      newTables.splice(table);
    } else {
      newTables.push(table);
    }
    this.setState({ tables: newTables });
  }

  manageType(number) {
    const newType = this.state.type;
    for (let i = 0; i < 2; i += 1) {
      if (i === number) {
        newType[i] = true;
      } else {
        newType[i] = false;
      }
    }
    this.setState({
      type: newType,
    });
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

    const tables = this.state.allTables ?
      this.props.bills.data.map(b => b.table) : this.state.tables;

    const j = this.state.endDate.add(1, 'days');
    for (const i = this.state.startDate; i < j; i.add(1, 'days')) {
      const day = {
        data: [],
        total: 0,
        qty: 0,
      };
      this.props.menuCategories.data.forEach((c) => {
        day[`${c.name}Qty`] = 0;
        day[`${c.name}Subtotal`] = 0;
      });
      tables.forEach((t) => {
        const row = {
          table: t,
          date: i.format('DD/MM/YYYY'),
          total: 0,
          qty: 0,
        };
        this.props.menuCategories.data.forEach((c, k) => {
          let qty = 0;
          let subTotal = 0;
          let items = [];

          this.props.bills.data.filter(b => (
            moment(b.createdAt).format('DD/MM/YYYY') === row.date
            &&
            b.table === t
          )).forEach((bill) => {
            const newItems = bill.menuItems.filter((item) => {
              if (this.state.allItems[k]) {
                return (
                  this.getItem(item.menuItem).menuCategory === c._id
                  &&
                  item.itemCancellation.canceled === !this.state.type[0]
                );
              }
              return (
                this.getItem(item.menuItem).menuCategory === c._id
                &&
                this.state.itemFilters.includes(item.menuItem)
                &&
                item.itemCancellation.canceled === !this.state.type[0]
              );
            });
            items = [...items, ...newItems];
          });

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
      this.props.history.push({
        pathname: `/relatorios/${this.state.type[0] ? 'faturado' : 'cancelados'}`,
        state: {
          report,
        },
      });
    }
  }

  generateReport() {
    if (
      this.state.startDate !== null
      &&
      this.state.endDate !== null
      &&
      (this.state.tables !== [] || this.state.allTables)
      &&
      (this.state.itemFilters !== [] || this.state.allItems.includes(true))
    ) {
      this.mountReport();
    }
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
            startDateId="startDate"
            endDateId="endDate"
            displayFormat="DD/MM/YYYY"
            initialVisibleMonth={() => moment().subtract(1, 'month')}
            monthFormat="MM/YYYY"
            isOutsideRange={d => d > moment()}
            startDatePlaceholderText="de"
            endDatePlaceholderText="até"
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
          />
          <div colSpan={1} />
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
                    label="mesas"
                    onChange={() => this.setState({ allTables: !this.state.allTables })}
                  />
                </td>
              </tr>
              {
                this.props.bills.data.map(i => (
                  <tr className="table-row" key={i._id}>
                    <td className="table-cell table--cell-equalWidth table--cell-tableNumber">{i.table}</td>
                    <td className="table-cell table--cell-equalWidth">
                      <Checkbox
                        label={i.table}
                        onChange={this.toggleTables}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
            this.props.menuCategories.data.map((c, k) => (
              <table className="full-w table-noSeparator" key={c._id}>
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
                        onChange={() => {
                          const allItems = [...this.state.allItems];
                          allItems[k] = !this.state.allItems[k];
                          this.setState({ allItems });
                        }}
                      />
                    </td>
                  </tr>
                  {
                    this.props.menuItems.data.filter(o => o.menuCategory === c._id).map(i => (
                      <tr className="table-row" key={i._id}>
                        <td className="table-cell table--cell-75Width">{this.getItem(i._id).name}</td>
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
                    checked={this.state.type[0]}
                    onChange={() => this.manageType(0)}
                  />
                </td>
              </tr>
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">PEDIDOS CANCELADOS</td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="cancelados"
                    checked={this.state.type[1]}
                    onChange={() => this.manageType(1)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button
            text="OK"
            type="secondary"
            size="square"
            onClick={() => this.generateReport()}
          />
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
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
