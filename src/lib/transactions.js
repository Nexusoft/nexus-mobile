import { scheduleNotificationAsync } from 'expo-notifications';

import * as TYPE from 'consts/actionTypes';
import { sendAPI } from 'lib/api';
import { getDeltaSign } from 'lib/contracts';
import { getTokenName } from 'lib/tokens';
import { refreshUserAccounts } from 'lib/user';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

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

const getBalanceChanges = (tx) =>
  tx.contracts
    ? tx.contracts.reduce((changes, contract) => {
        const sign = getDeltaSign(contract);
        if (sign && contract.amount) {
          let change = changes.find(
            contract.token_name
              ? (change) => change.token_name === contract.token_name
              : (change) => change.token === contract.token
          );
          if (change) {
            change.amount =
              change.amount + (sign === '-' ? -1 : 1) * contract.amount;
          } else {
            change = {
              token_name: contract.token_name,
              token: contract.token,
              amount: (sign === '-' ? -1 : 1) * contract.amount,
            };
            changes.push(change);
          }
        }
        return changes;
      }, [])
    : 0;

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
        getStore().dispatch({
          type: TYPE.ADD_TRANSACTIONS,
          payload: {
            list: transactions,
          },
        });
        console.log('new txs', transactions);

        transactions.forEach((tx) => {
          if (!isConfirmed(tx)) {
            watchTransaction(tx.txid);
          }

          const changes = getBalanceChanges(tx);
          console.log('changes', changes);
          if (changes.length) {
            const changeLines = changes.map(
              (change) =>
                `${change.amount >= 0 ? '+' : ''}${formatNumber(
                  change.amount
                )} ${getTokenName(change, { markup: false })}`
            );
            scheduleNotificationAsync({
              content: {
                title: 'New transaction',
                body: changeLines.join(' \n'),
                data: { type: 'new_transaction', txid: tx.txid },
              },
              trigger: null,
            });
          }
        });
      }
    }
  );
}
