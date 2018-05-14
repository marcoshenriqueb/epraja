import React from 'react';
import PropTypes from 'prop-types';
import './cancellation.styl';

import Button from './../../components/button/button';

const Cancellation = ({
  table,
  name,
  comment,
  owner,
  changeOwner,
  cancelItem,
  close,
}) => (
  <div className="full-w flex justify-center">
    <div className="modal flex-column stretch">
      <div className="modal-header">
        <h2 className="modal-header--title">Cancelamento</h2>
      </div>
      <table className="modal-table full-w">
        <thead>
          <tr className="modal-table--head">
            <th>
              <div className="font-padding">
                Mesa
              </div>
            </th>
            <th>
              <div className="font-padding">
                Nome
              </div>
            </th>
            <th>
              <div className="font-padding">
                Comentário
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="modal-table--itemRow">
            <td className="modal-table--item">
              <div className="font-padding">{table}</div>
            </td>
            <td className="modal-table--item">
              <div className="font-padding">{name}</div>
            </td>
            <td className="modal-table--item">
              <div className="font-padding">{comment}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="modal-footer flex-column space-around">
        <div className="modal-footer--item flex space-around full-w">
          <h4 className="modal-footer--label">Quem solicitou o cancelamento?</h4>
          <div>
            <Button
              text="Cliente"
              type={owner === 'Cliente' ? 'secondary' : ''}
              onClick={() => changeOwner('Cliente')}
            />
            <span />
            <Button
              text="O Local"
              type={owner === 'Estabelecimento' ? 'secondary' : ''}
              onClick={() => changeOwner('Estabelecimento')}
            />
          </div>
        </div>
        <div className="modal-footer--item flex space-around full-w">
          <Button
            text="Confirmar Cancelamento"
            type="secondary"
            onClick={() => cancelItem()}
          />
          <Button
            text="Voltar"
            type="secondary"
            onClick={() => close()}
          />
        </div>
      </div>
    </div>
  </div>
);


Cancellation.propTypes = {
  table: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  comment: PropTypes.string,
  owner: PropTypes.string.isRequired,
  cancelItem: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  changeOwner: PropTypes.func.isRequired,
};

Cancellation.defaultProps = {
  comment: '',
};

export default Cancellation;
