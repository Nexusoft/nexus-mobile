import * as TYPE from 'consts/actionTypes';

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_USER_ACCOUNTS:
      return action.payload;

    case TYPE.SET_USER_ACCOUNT: {
      const { address, account } = action.payload;
      const accounts = [...(state || [])];
      const index = accounts.findIndex((acc) => acc.address === address);
      if (index !== -1) {
        accounts.splice(index, 1, account);
        return accounts;
      } else {
        return state;
      }
    }

    case TYPE.DISCONNECT_CORE:
    case TYPE.ACTIVE_USER:
    case TYPE.CLEAR_USER:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
