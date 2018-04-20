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
  updateBillItemCancellation: updateBillItemCancellationAction,
} = actions;

class Cancellation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: 'Cliente',
    };
  }

  componentDidMount() {
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
    this.props.updateBillItemCancellation(this.props.match.params.id, this.state.owner)
      .then(() => {
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
          <table className="modal-table full-w">
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
                <td className="modal-table--item">
                  {this.getItem(this.props.match.params.item).name}
                </td>
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
                  type={this.getButtonType('Cliente')}
                  onClick={() => this.setState({ owner: 'Cliente' })}
                />
                <span />
                <Button
                  text="O Local"
                  type={this.getButtonType('Estabelecimento')}
                  onClick={() => this.setState({ owner: 'Estabelecimento' })}
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
  updateBillItemCancellation: PropTypes.func.isRequired,
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
    updateBillItemCancellation: (id, owner) => (
      dispatch(updateBillItemCancellationAction(id, owner))
    ),
  }
))(Cancellation);

export default CancellationConnector;
