import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_APP_LOCKED:
      return action.payload;

    case TYPE.ACTIVE_USER:
    case TYPE.LOGOUT:
      return false;

    default:
      return state;
  }
};
