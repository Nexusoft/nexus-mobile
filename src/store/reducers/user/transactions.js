import * as TYPE from 'consts/actionTypes';

const initialState = {
  filter: {
    open: false,
    operation: null,
    timeSpan: null,
    accountQuery: '',
    tokenQuery: '',
  },
  transactions: [],
  loading: false,
  loaded: 'none', // none | partly | all
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.TOGGLE_TXS_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          open: !state.txFilterOpen,
        },
      };

    case TYPE.UPDATE_TRANSACTIONS_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };

    case TYPE.START_FETCHING_TXS:
      return {
        ...state,
        loading: true,
        loaded: action.payload.reload ? 'none' : state.loaded,
        transactions: action.payload.reload ? [] : state.transactions,
      };

    case TYPE.FETCH_TXS_RESULT:
      return {
        ...state,
        loading: false,
        loaded: action.payload.loadedAll ? 'all' : 'partly',
        transactions: action.payload.transactions,
      };

    case TYPE.STOP_FETCHING_TXS:
      return {
        ...state,
        loading: false,
      };

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
