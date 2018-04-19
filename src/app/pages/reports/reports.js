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
      allTables: false,
      type: [false, false, false],
      startDate: null,
      endDate: null,
      focusedInput: null,
    };

    this.toggleItemFilters = this.toggleItemFilters.bind(this);
    this.toggleTables = this.toggleTables.bind(this);
    console.log(this.props);
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
    for (let i = 0; i < 3; i += 1) {
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

  mountFaturado() {
    const data = [];
    const j = this.state.endDate.add(1, 'days');

    for (const i = this.state.startDate; i < j; i.add(1, 'days')) {
      const day = {};
      day.date = i.format('DD/MM/YYYY');
      day.data = [];

      this.state.tables.forEach((t) => {
        let total = 0;
        const row = {};
        row.table = t;

        this.props.menuCategories.data.forEach((c) => {
          let qty = 0;
          let subTotal = 0;
          const bills = this.props.bills.data.filter((b) => {
            console.log(b.table === t);
            console.log(moment(b.createdAt).format('DD/MM/YYYY') === row.day);
            console.log(moment(b.createdAt).format('DD/MM/YYYY'));
            console.log(row.day);
            return moment(b.createdAt).format('DD/MM/YYYY') === row.day && b.table === t;
          });
          console.log(bills);
          let items = [];
          bills.forEach((bill) => {
            const newItems = bill.menuItems.filter(item => (
              this.getItem(item.menuItem).menuCategory === c._id
            ));
            console.log(newItems);
            items = [...items, ...newItems];
            console.log(items);
          });
          items.forEach((item) => {
            qty += 1;
            subTotal += this.getItem(item.menuItem).price;
          });
          row[`c${qty}`] = qty;
          row[`c${subTotal}`] = subTotal;
          total += subTotal;
        });

        row.total = total;
        if (total > 0) day.data.push(row);
      });
      if (day.data.length > 0) data.push(day);
    }
    if (data.length > 0) {
      this.props.history.push({
        pathname: '/relatorios/faturado',
        state: {
          data,
        },
      });
    }
  }

  mountCancelados() {
    const j = this.state.endDate.add(1, 'days');
    for (const i = this.state.startDate; i < j; i.add(1, 'days')) {
      console.log(this.state.data);
    }
  }

  mountTempo() {
    const j = this.state.endDate.add(1, 'days');
    for (const i = this.state.startDate; i < j; i.add(1, 'days')) {
      console.log(i);
    }
  }

  generateReport() {
    if (
      this.state.startDate !== null
      &&
      this.state.endDate !== null
      &&
      this.state.tables !== []
      &&
      this.state.itemFilters !== []
    ) {
      if (this.state.type[0]) {
        this.mountFaturado();
      } else if (this.state.type[1]) {
        this.mountCancelados();
      } else if (this.state.type[2]) {
        this.mountTempo();
      }
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
                    label="todasmesas"
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
            this.props.menuCategories.data.map(c => (
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
                        label={`todas${c.name}`}
                        onChange={this.toggleItemFilters}
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
              <tr className="table-row">
                <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">TEMPO DE ATENDIMENTO</td>
                <td className="table-cell table--cell-fixedWidth">
                  <Checkbox
                    label="tempo"
                    checked={this.state.type[2]}
                    onChange={() => this.manageType(2)}
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
