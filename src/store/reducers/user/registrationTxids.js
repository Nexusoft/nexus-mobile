import * as TYPE from 'consts/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_REGISTRATION_TXID: {
      const { username, txid } = action.payload;
      return {
        ...state,
        [username]: txid,
      };
    }

    case TYPE.DISCONNECT_CORE:
      return initialState;

    default:
      return state;
  }
};
