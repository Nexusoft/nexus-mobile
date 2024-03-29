import * as TYPE from 'consts/actionTypes';

const initialState = {
  open: false,
  operation: null,
  timeSpan: null,
  addressQuery: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.TOGGLE_TXS_FILTER:
      return {
        ...state,
        open: !state.open,
      };

    case TYPE.UPDATE_TRANSACTIONS_FILTER:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
