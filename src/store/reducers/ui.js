import * as TYPE from 'consts/actionTypes';

const initialState = {
  txFilterOpen: false,
  contactSearch: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.TOGGLE_TRANSACTIONS_FILTER:
      return { ...state, txFilterOpen: !state.txFilterOpen };

    case TYPE.SEARCH_CONTACTS:
      return { ...state, contactSearch: action.payload };

    default:
      return state;
  }
};
