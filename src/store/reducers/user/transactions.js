import * as TYPE from 'consts/actionTypes';

const initialState = {
  transactions: [],
  loading: false,
  loaded: 'none', // none | partly | all
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.START_FETCHING_TXS: {
      const { reload } = action.payload;
      return {
        ...state,
        loading: true,
        loaded: reload ? 'none' : state.loaded,
        transactions: reload ? [] : state.transactions,
      };
    }

    case TYPE.FETCH_TXS_RESULT: {
      const { transactions, loadedAll } = action.payload;
      return {
        ...state,
        loading: false,
        loaded: loadedAll ? 'all' : 'partly',
        transactions: [...transactions, ...state.transactions],
      };
    }

    case TYPE.STOP_FETCHING_TXS:
      return {
        ...state,
        loading: false,
      };

    case TYPE.UPDATE_TRANSACTION: {
      if (loaded !== 'none') {
        const txid = action.payload?.txid;
        const index = state.transactions.findIndex((tx) => tx.txid === txid);
        if (txid && index >= 0) {
          const newTransactions = [...state.transactions];
          newTransactions.splice(index, 1, action.payload);
          return {
            ...state,
            transactions: newTransactions,
          };
        }
      }
      return state;
    }

    case TYPE.ADD_TRANSACTIONS:
      if (loaded !== 'none') {
        return {
          ...state,
          transactions: [...action.payload, ...state.transactions],
        };
      } else {
        return state;
      }

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
