import * as TYPE from 'consts/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.ADD_TRANSACTIONS:
      return (
        action.payload.list &&
        action.payload.list.reduce(
          (map, tx) => {
            map[tx.txid] = tx;
            return map;
          },
          { ...state }
        )
      );

    case TYPE.UPDATE_TRANSACTION:
      return {
        ...state,
        [action.payload.txid]: action.payload,
      };

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
