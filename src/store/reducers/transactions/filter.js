import * as TYPE from 'consts/actionTypes';

const initialState = {
  open: false,
  operation: null,
  timeSpan: null,
  nameQuery: '',
  addressQuery: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.TOGGLE_TXS_FILTER:
      return { ...state, txFilterOpen: !state.txFilterOpen };

    case TYPE.SET_TXS_OP_FILTER:
      return {
        ...state,
        operation: action.payload,
      };

    case TYPE.SET_TXS_TIME_FILTER:
      return {
        ...state,
        timeSpan: action.payload,
      };

    case TYPE.SET_TXS_NAME_QUERY:
      return {
        ...state,
        nameQuery: action.payload,
      };

    case TYPE.SET_TXS_ADDRESS_QUERY:
      return {
        ...state,
        addressQuery: action.payload,
      };

    default:
      return state;
  }
};
