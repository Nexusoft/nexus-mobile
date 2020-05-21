import * as TYPE from 'consts/actionTypes';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SHOW_NOTIFICATION:
      return [...state, action.payload];

    case TYPE.DISMISS_NOTIFICATION:
      return state.filter((notif) => notif.id !== action.payload);

    default:
      return state;
  }
};
