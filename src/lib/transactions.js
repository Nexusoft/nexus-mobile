import { scheduleNotificationAsync } from 'expo-notifications';

import TokenName from 'components/TokenName';
import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getDeltaSign } from 'lib/contracts';
import { refreshUserAccounts } from 'lib/user';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

export const isConfirmed = (tx) => !!tx.confirmations;

const limit = 20;
export async function loadTransactions({ reload } = { reload: false }) {
  const store = getStore();
  const {
    transactions: { txMap },
  } = store.getState();
  const loadedTransactions = Object.values(txMap);
  const offset = reload ? 0 : loadedTransactions.length;

  const transactions = await callAPI('users/list/transactions', {
    verbose: 'summary',
    limit,
    offset,
  });
  store.dispatch({
    type: reload ? TYPE.RELOAD_TRANSACTIONS : TYPE.ADD_TRANSACTIONS,
    payload: {
      list: transactions,
      endReached: transactions.length < limit,
    },
  });

  transactions.forEach((tx) => {
    if (!isConfirmed(tx)) {
      watchTransaction(tx.txid);
    }
  });
}

export async function loadGenesis() {
  const result = await callAPI('users/list/transactions', {
    verbose: 'summary',
    limit: 1,
    where: [
      {
        field: 'type',
        op: '=',
        value: 'tritium first',
      },
    ],
  });
  getStore().dispatch({
    type: TYPE.UPDATE_TRANSACTION,
    payload: result[0],
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
  const tx = await callAPI('ledger/get/transaction', {
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
  // Update everytime a new block is received
  const unsubscribe = getStore().observe(
    ({ core: { info } }) => info?.blocks,
    async (blocks) => {
      if (!blocks) return;
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

export function watchNewTransactions() {
  getStore().observe(
    (state) => state,
    async (state, oldState) => {
      if (!oldState || !state) return;
      const txCount = state?.user?.status?.transactions;
      const oldTxCount = oldState?.user?.status?.transactions;
      const wasSyncing = oldState?.core?.info?.synchronizing;
      if (
        txCount > oldTxCount &&
        typeof txCount === 'number' &&
        typeof oldTxCount === 'number' &&
        !wasSyncing
      ) {
        const transactions = await callAPI('users/list/transactions', {
          verbose: 'summary',
          limit: txCount - oldTxCount,
        });
        getStore().dispatch({
          type: TYPE.ADD_TRANSACTIONS,
          payload: {
            list: transactions,
          },
        });

        transactions.forEach((tx) => {
          if (!isConfirmed(tx)) {
            watchTransaction(tx.txid);
          }

          const changes = getBalanceChanges(tx);
          if (changes.length) {
            const changeLines = changes.map(
              (change) =>
                `${change.amount >= 0 ? '+' : ''}${formatNumber(
                  change.amount
                )} ${TokenName.from({ contract: change })}`
            );
            scheduleNotificationAsync({
              content: {
                title: 'New transaction',
                body: changeLines.join(' \n'),
                data: { type: 'new_transaction', txid: tx.txid },
              },
              trigger: null,
              channelId: 'transaction-channel-id',
            });
          }
        });
      }
    }
  );
}
