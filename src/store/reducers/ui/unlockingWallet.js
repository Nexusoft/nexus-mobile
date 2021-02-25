import * as TYPE from 'consts/actionTypes';

const initialState = false;

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
