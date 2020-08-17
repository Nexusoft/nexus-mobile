import * as TYPE from 'consts/actionTypes';

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_USER_ACCOUNTS:
      return action.payload;

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
    case TYPE.CLEAR_USER_ACCOUNTS:
      return initialState;

    default:
      return state;
  }
};