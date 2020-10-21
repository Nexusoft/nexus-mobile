import * as TYPE from 'consts/actionTypes';
import { sendAPI } from 'lib/api';
import { refreshUserAccounts } from 'lib/user';
import { getStore } from 'store';

export const isConfirmed = (tx) => !!tx.confirmations;

const limit = 20;
export async function loadTransactions() {
  const store = getStore();
  const {
    transactions: { txMap },
  } = store.getState();
  const loadedTransactions = Object.values(txMap);
  const page = Math.floor(loadedTransactions.length / limit);

  const transactions = await sendAPI('users/list/transactions', {
    verbose: 'summary',
    limit,
    page,
  });
  store.dispatch({
    type: TYPE.ADD_TRANSACTIONS,
    payload: {
      list: transactions,
      endReached: transactions.length < limit,
    },
  });

  watchNewTransactions();

  transactions.forEach((tx) => {
    if (!isConfirmed(tx)) {
      watchTransaction(tx.txid);
    }
  });
}

export async function fetchTransaction(txid) {
  const tx = await sendAPI('ledger/get/transaction', {
    txid,
    verbose: 'summary',
  });
  getStore().dispatch({
    type: TYPE.UPDATE_TRANSACTION,
    payload: tx,
  });
  return tx;
}

function watchTransaction(txid) {
  const store = getStore();
  // Update everytime a new block is received
  const unsubscribe = store.observe(
    ({ core: { info } }) => info?.blocks,
    async (blocks) => {
      if (!blocks) return;
      refreshUserAccounts();
      unsubscribe();
      return;
      const tx = await fetchTransaction(txid);
      if (tx && isConfirmed(tx)) {
        unsubscribe();
        // Reload the account list
        // so that the account balances (available & unconfirmed) are up-to-date
        refreshUserAccounts();
      }
    }
  );
}

function watchNewTransactions() {
  getStore().observe(
    ({ user: { status } }) => status?.transactions,
    async (txCount, oldTxCount) => {
      if (
        txCount > oldTxCount &&
        typeof txCount === 'number' &&
        typeof oldTxCount === 'number'
      ) {
        const transactions = await sendAPI('users/list/transactions', {
          verbose: 'summary',
          limit: txCount - oldTxCount,
        });
        store.dispatch({
          type: TYPE.ADD_TRANSACTIONS,
          payload: {
            list: transactions,
          },
        });
      }
    }
  );
}
