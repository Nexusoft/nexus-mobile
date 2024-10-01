import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_SESSION_SAVED:
      return action.payload;

    case TYPE.ACTIVE_USER:
    case TYPE.SET_USER_STATUS:
      return initialState;

    default:
      return state;
  }
};
