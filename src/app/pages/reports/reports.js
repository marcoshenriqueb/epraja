import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './reports.styl';

import actions from './../../store/actions';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchMenuItems: fetchMenuItemsAction,
  fetchMenuCategories: fetchMenuCategoriesAction,
} = actions;

class Reports extends React.Component {
  componentDidMount() {
    this.props.fetchBills();
    this.props.fetchMenuItems();
    this.props.fetchMenuCategories();
  }

  componentWillUnmount() {
    this.props.resetBills();
  }

  getCategory(id) {
    const result = this.props.menuCategories.data.filter(c => c._id === id);

    return result.length ? result[0].name.toLowerCase() : '';
  }

  getItemName(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0] : {};
  }

  render() {
    return (
      <div className="full-w flex-column start wrap reports-container">
        <div className="flex reports-header full-w">
          <h3>Relatórios</h3>
        </div>
        <div className="flex reports-filters full-w">
          <table>
            <thead>
              <tr>
                <th>Mesas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>oi</td>
                <td>oi</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Comidas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>oi</td>
                <td>oi</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Bebidas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>oi</td>
                <td>oi</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex reports-footer full-w">
          asd
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
