import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './cancellation.styl';

import actions from './../../store/actions';
import Button from './../../components/button/button';

const {
  fetchBills: fetchBillsAction,
  resetBills: resetBillsAction,
  fetchMenuItems: fetchMenuItemsAction,
  removeBillItem: removeBillItemAction,
} = actions;

class Cancellation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: 'cliente',
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.props.fetchBills();
    this.props.fetchMenuItems();
  }

  componentWillUnmount() {
    this.props.resetBills();
  }

  getTable() {
    const result = this.props.bills.data.filter(b => b._id === this.props.match.params.bill);

    return result.length ? result[0] : {};
  }

  getItem(id) {
    const result = this.props.menuItems.data.filter(i => i._id === id);

    return result.length ? result[0] : {};
  }

  getButtonType(button) {
    return button === this.state.owner ? 'secondary' : '';
  }

  cancelItem() {
    Promise.all([
      this.props.removeBillItem(this.props.match.params.bill, this.props.match.params.id),
    ]).then(() => {
      this.props.history.goBack();
    });
  }

  render() {
    return (
      <div className="full-w flex justify-center">
        <div className="modal flex-column stretch">
          <div className="modal-header">
            <h2 className="modal-header--title">Cancelamento</h2>
          </div>
          <table className="modal-table">
            <thead>
              <tr className="modal-table--head">
                <th>Mesa</th>
                <th>Nome</th>
                <th>Comentário</th>
              </tr>
            </thead>
            <tbody>
              <tr className="modal-table--itemRow">
                <td className="modal-table--item">{this.getTable().table}</td>
                <td className="modal-table--item">{this.getItem(this.props.match.params.item).name}</td>
                <td className="modal-table--item">-</td>
              </tr>
            </tbody>
          </table>
          <div className="modal-footer flex-column space-around">
            <div className="modal-footer--item flex space-around full-w">
              <h4>Quem solicitou o cancelamento?</h4>
              <div>
                <Button
                  text="Cliente"
                  type={this.getButtonType('cliente')}
                  onClick={() => this.setState({ owner: 'cliente' })}
                />
                <span />
                <Button
                  text="O Local"
                  type={this.getButtonType('local')}
                  onClick={() => this.setState({ owner: 'local' })}
                />
              </div>
            </div>
            <div className="modal-footer--item flex space-around full-w">
              <Button
                text="Confirmar Cancelamento"
                type="secondary"
                onClick={() => this.cancelItem()}
              />
              <Button
                text="Voltar"
                type="secondary"
                onClick={() => this.props.history.goBack()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Cancellation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      item: PropTypes.string.isRequired,
      bill: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  bills: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      menuItems: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired).isRequired,
  }).isRequired,
  menuItems: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  fetchBills: PropTypes.func.isRequired,
  resetBills: PropTypes.func.isRequired,
  fetchMenuItems: PropTypes.func.isRequired,
  removeBillItem: PropTypes.func.isRequired,
};

const CancellationConnector = connect(state => (
  {
    bills: state.bill.bills,
    menuItems: state.menuItem.menuItems,
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
    removeBillItem: (bill, id) => (
      dispatch(removeBillItemAction(bill, id))
    ),
  }
))(Cancellation);

export default CancellationConnector;
