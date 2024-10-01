import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_IGNORE_SAVED_SESSION:
      return action.payload;

    default:
      return state;
  }
};
