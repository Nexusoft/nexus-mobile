import * as TYPE from 'consts/actionTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.UPDATE_PRICES:
      return action.payload;

    default:
      return state;
  }
};
