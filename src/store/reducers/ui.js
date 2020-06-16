import * as TYPE from 'consts/actionTypes';

const initialState = {
  txFilterOpen: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.TOGGLE_TRANSACTIONS_FILTER:
      return { ...state, txFilterOpen: !state.txFilterOpen };

    default:
      return state;
  }
};
