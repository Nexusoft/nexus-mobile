import * as TYPE from 'consts/actionTypes';

// null indicates that the wallet hasn't checked for user session yet
const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.OPEN_UNLOCK_SCREEN:
      return true;

    case TYPE.CLOSE_UNLOCK_SCREEN:
      return false;

    default:
      return state;
  }
};
