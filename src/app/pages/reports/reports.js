import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import { Link } from 'react-router-dom';
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
  fetchBillStatuses: fetchBillStatusesAction,
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
      emptyFilters: [],
      reportName: '',
    };
    this.toggleItemFilters = this.toggleItemFilters.bind(this);
    this.toggleTables = this.toggleTables.bind(this);
    this.generateReport = this.generateReport.bind(this);
  }

  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchMenuItems();
    this.props.fetchMenuCategories();
    this.props.fetchBillStatuses();
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

  getBillStatusName(id) {
    const result = this.props.billStatuses.data.filter(s => s._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
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
      &&
      this.getBillStatusName(b.billStatus) === 'fechada'
    )).forEach((bill) => {
      const canceled = this.state.type === 1;
      result = [...bill.menuItems.filter((item) => {
        let timeReportValidation = true;
        if (
          (this.state.type === 2) && (((item.forwardedAt || item.deliveredAt) === undefined))
        ) {
          timeReportValidation = false;
        }
        return (
          this.getItem(item.menuItem).menuCategory === category._id
          &&
          this.state.itemFilters.includes(item.menuItem)
          &&
          item.canceled === canceled
          &&
          timeReportValidation
        );
      })];
    });

    return result;
  }

  getReportHeader() {
    const report = {
      data: [],
      titlesKeys: ['date', 'table'],
      titlesValues: ['DATA', 'MESA'],
      date: `${this.state.startDate.format('MMMM/YYYY')}
        até ${this.state.endDate.format('MMMM/YYYY')}`,
    };
    this.props.menuCategories.data.forEach((c) => {
      report.titlesKeys.push(`${c.name}Qty`);
      report.titlesValues.push(`${c.name.toUpperCase()}`);
      report[`${c.name}Qty`] = 0;
      if (this.state.type !== 2) {
        report.titlesKeys.push(`${c.name}Subtotal`);
        report.titlesValues.push(`R$ ${c.name.toUpperCase()}`);
        report[`${c.name}Subtotal`] = 0;
      } else {
        report.titlesKeys.push(`${c.name}TMFeito`, `${c.name}TMEntrega`, `${c.name}TMTot`);
        report.titlesValues.push('T.M. FAZER', 'T.M. ENTREGA', 'TOTAL');
        report[`${c.name}TMFeito`] = 0;
        report[`${c.name}Feito`] = 0;
        report[`${c.name}TMEntrega`] = 0;
        report[`${c.name}Entrega`] = 0;
        report[`${c.name}TMTot`] = 0;
      }
    });
    if (this.state.type !== 2) {
      report.total = 0;
      report.qty = 0;
      report.titlesKeys.push('qty', 'total');
      report.titlesValues.push('TOTAL', 'R$ TOTAL');
    }

    return report;
  }

  getRowData(date, table) {
    const row = {
      table,
      date: date.format('DD/MM/YYYY'),
    };
    if (this.state.type !== 2) {
      row.total = 0;
      row.qty = 0;
    }

    this.props.menuCategories.data.forEach((c) => {
      let qty = 0;
      let subTotal = 0;
      let TFeito = 0;
      let TEntrega = 0;
      const items = this.getBillItemsFromTableCategoryAndDate(row.table, c, row.date);

      items.forEach((item) => {
        qty += 1;
        if (this.state.type !== 2) {
          subTotal += this.getItem(item.menuItem).price;
        } else {
          TFeito += moment.duration(moment(item.forwardedAt)
            .diff(moment(item.createdAt))).seconds();
          TEntrega += moment.duration(moment(item.deliveredAt)
            .diff(moment(item.forwardedAt))).seconds();
        }
      });
      row[`${c.name}Qty`] = qty;

      if (this.state.type !== 2) {
        row[`${c.name}Subtotal`] = subTotal;
        row.qty += qty;
        row.total += subTotal;
      } else {
        row[`${c.name}Feito`] = TFeito;
        row[`${c.name}Entrega`] = TEntrega;
        row[`${c.name}TMFeito`] = moment.duration(TFeito / qty, 'seconds');
        row[`${c.name}TMEntrega`] = moment.duration(TEntrega / qty, 'seconds');
        row[`${c.name}TMTot`] = row[`${c.name}TMFeito`].clone().add(row[`${c.name}TMEntrega`]);
      }
    });

    return row;
  }

  getDayData(date) {
    const day = {
      data: [],
    };
    if (this.state.type !== 2) {
      day.total = 0;
      day.qty = 0;
    }
    this.props.menuCategories.data.forEach((c) => {
      day[`${c.name}Qty`] = 0;
      if (this.state.type !== 2) {
        day[`${c.name}Subtotal`] = 0;
      } else {
        day[`${c.name}TMFeito`] = 0;
        day[`${c.name}TMEntrega`] = 0;
        day[`${c.name}Feito`] = 0;
        day[`${c.name}Entrega`] = 0;
      }
    });

    this.state.tables.forEach((t) => {
      const row = this.getRowData(date, t);

      this.props.menuCategories.data.forEach((c) => {
        day[`${c.name}Qty`] += row[`${c.name}Qty`];
        if (this.state.type !== 2) {
          day.qty += row[`${c.name}Qty`];
          day.total += row[`${c.name}Subtotal`];
          day[`${c.name}Subtotal`] += row[`${c.name}Subtotal`];
        } else {
          day[`${c.name}Feito`] += row[`${c.name}Feito`];
          day[`${c.name}Entrega`] += row[`${c.name}Entrega`];
        }
      });

      let hasData = false;
      this.props.menuCategories.data.forEach((c) => {
        if (row[`${c.name}Qty`] > 0) hasData = true;
      });

      if (hasData) day.data.push(row);
    });
    if (this.state.type === 2) {
      this.props.menuCategories.data.forEach((c) => {
        day[`${c.name}TMFeito`] = moment
          .duration(day[`${c.name}Feito`] / day[`${c.name}Qty`], 'seconds');
        day[`${c.name}TMEntrega`] = moment
          .duration(day[`${c.name}Entrega`] / day[`${c.name}Qty`], 'seconds');
        day[`${c.name}TMTot`] = day[`${c.name}TMFeito`].clone().add(day[`${c.name}TMEntrega`]);
      });
    }

    return day;
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
    const report = this.getReportHeader();

    const j = this.state.endDate.clone();

    for (const i = this.state.startDate.clone(); i <= j; i.add(1, 'days')) {
      const day = this.getDayData(i);

      this.props.menuCategories.data.forEach((c) => {
        report[`${c.name}Qty`] += day[`${c.name}Qty`];

        if (this.state.type !== 2) {
          report.qty += day[`${c.name}Qty`];
          report.total += day[`${c.name}Subtotal`];
          report[`${c.name}Subtotal`] += day[`${c.name}Subtotal`];
        } else {
          report[`${c.name}Feito`] += day[`${c.name}Feito`];
          report[`${c.name}Entrega`] += day[`${c.name}Entrega`];
        }
      });

      if (day.data.length) report.data.push(day);
    }
    if (this.state.type === 2) {
      this.props.menuCategories.data.forEach((c) => {
        report[`${c.name}TMFeito`] = moment
          .duration(report[`${c.name}Feito`] / report[`${c.name}Qty`], 'seconds');
        report[`${c.name}TMEntrega`] = moment
          .duration(report[`${c.name}Entrega`] / report[`${c.name}Qty`], 'seconds');
        report[`${c.name}TMTot`] = report[`${c.name}TMFeito`].clone().add(report[`${c.name}TMEntrega`]);
      });
    }
    if (report.data.length) {
      this.setState({ data: report });
    } else {
      this.setState({ emptyFilters: ['Não há dados existentes para esses filtros'] });
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
      if (this.state.emptyFilters.length) this.setState({ emptyFilters: [] });
      this.mountReport();
    } else {
      const emptyFilters = [];
      if (this.state.startDate === null) emptyFilters.push('DATA INICIAL não selecionada!');
      if (this.state.endDate === null) emptyFilters.push('DATA FINAL não selecionada!');
      if (!this.state.tables.length) emptyFilters.push('Nenhuma MESA selecionada!');
      if (!this.state.itemFilters.length) emptyFilters.push('Nenhum ITEM selecionado!');
      this.setState({ emptyFilters });
    }
  }

  render() {
    if (this.state.data === null) {
      return (
        <div className="full-w flex-column start wrap reports-container">
          <Link to="/" key="1">
            <div className="flex justify-center center div-back">
              <img src={arrowImg} alt="Voltar" />
              <h3 className="button-back">Voltar</h3>
            </div>
          </Link>
          <div className="flex reports-header full-w space-between">
            <h1>Relatórios</h1>
            <DateRangePicker
              required
              showClearDates
              showDefaultInputIcon
              hideKeyboardShortcutsPanel
              displayFormat="DD/MM/YYYY"
              initialVisibleMonth={() => moment().subtract(1, 'month')}
              monthFormat="MMMM/YYYY"
              isOutsideRange={d => d.clone().subtract(12, 'hours') > moment()}
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
                    <th className="table-header">
                      <div className="font-padding">Mesas</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="table-cell table--cell-equalWidth table--cell-tableNumber">
                      <div className="font-padding">Todos</div>
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
                          <div className="font-padding">{i.table}</div>
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
                        <th className="table-header" colSpan={2}>
                          <div className="font-padding">{this.getCategoryName(c._id)}</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-row">
                        <td className="table-cell table--cell-75Width">
                          <div className="font-padding">Todos</div>
                        </td>
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
                              <div className="font-padding">
                                {this.getItem(i._id).name}
                              </div>
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
                    <h2 className="table-header--secondaryTitle font-padding">
                      Tipos de Relatório
                    </h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-row">
                  <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                    <div className="font-padding">FATURADO</div>
                  </td>
                  <td className="table-cell table--cell-fixedWidth">
                    <Checkbox
                      label="faturado"
                      checked={this.state.type === 0}
                      onChange={() => this.setState({ type: 0, reportName: 'Faturado' })}
                    />
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                    <div className="font-padding">PEDIDOS CANCELADOS</div>
                  </td>
                  <td className="table-cell table--cell-fixedWidth">
                    <Checkbox
                      label="cancelados"
                      checked={this.state.type === 1}
                      onChange={() => this.setState({ type: 1, reportName: 'Cancelados' })}
                    />
                  </td>
                </tr>
                <tr className="table-row">
                  <td className="table-cell table--cell-fixedHeight table--cell-tableNumber">
                    <div className="font-padding">TEMPO DE ATENDIMENTO</div>
                  </td>
                  <td className="table-cell table--cell-fixedWidth">
                    <Checkbox
                      label="tempo"
                      checked={this.state.type === 2}
                      onChange={
                        () => this.setState({ type: 2, reportName: 'Tempo de Atendimento' })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              {
                this.state.emptyFilters.map(f => (
                  <h4 className="emptyFilters--alert" key={f}>{f}</h4>
                ))
              }
            </div>
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
          title={this.state.reportName}
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
  billStatuses: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchMenuItems: PropTypes.func.isRequired,
  fetchMenuCategories: PropTypes.func.isRequired,
  fetchBillStatuses: PropTypes.func.isRequired,
};

const ReportsConnector = connect(state => (
  {
    bills: state.bill.bills,
    menuItems: state.menuItem.menuItems,
    menuCategories: state.menuCategory.menuCategories,
    billStatuses: state.billStatus.billStatuses,
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
    fetchBillStatuses: () => (
      dispatch(fetchBillStatusesAction())
    ),
  }
))(Reports);

export default ReportsConnector;
