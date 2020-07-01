import * as TYPE from 'consts/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.OPEN_DIALOG:
      return [...state, action.payload];

    case TYPE.CLOSE_DIALOG:
      return state.filter((dialog) => dialog && dialog.id !== action.payload);

    default:
      return state;
  }
};
