import { scheduleNotificationAsync } from 'expo-notifications';

import TokenName from 'components/TokenName';
import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getDeltaSign } from 'lib/contracts';
import { refreshUserAccounts } from 'lib/user';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

export const isConfirmed = (tx) => !!tx.confirmations;

function watchIfUnconfirmed(transactions) {
  transactions?.forEach((tx) => {
    if (!isConfirmed(tx)) {
      watchTransaction({ txid: tx.txid });
    }
  });
}

const limit = 20;
export async function loadTransactions({ reload } = { reload: false }) {
  const store = getStore();
  const {
    user: {
      transactions: { transactions: currentTransactions },
    },
    ui: { transactionsFilter },
  } = store.getState();
  const offset = reload ? 0 : currentTransactions.length;

  store.dispatch({
    type: TYPE.START_FETCHING_TXS,
    payload: { reload },
  });
  try {
    const transactions = await callAPI('users/list/transactions', {
      verbose: 'summary',
      limit,
      offset,
    });
    store.dispatch({
      type: TYPE.FETCH_TXS_RESULT,
      payload: {
        reload,
        transactions,
        loadedAll: transactions.length < limit,
      },
    });
    watchIfUnconfirmed(transactions);
  } catch (err) {
    store.dispatch({
      type: TYPE.STOP_FETCHING_TXS,
    });
  }
}

// Obsolete
// export async function refreshGenesisTx() {
//   return await fetchTransaction({
//     where: [
//       {
//         field: 'type',
//         op: '=',
//         value: 'tritium first',
//       },
//     ],
//     limit: 1,
//   });
// }

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

export async function fetchTransaction({ txid, where, limit }) {
  let tx;
  if (where) {
    const txs = await callAPI('users/list/transactions', {
      verbose: 'summary',
      limit,
      where,
    });
    tx = txs?.[0];
  } else {
    tx = await callAPI('ledger/get/transaction', {
      txid,
      verbose: 'summary',
    });
  }
  if (tx) {
    getStore().dispatch({
      type: TYPE.UPDATE_TRANSACTION,
      payload: tx,
    });
  }
  return tx;
}

function watchTransaction({ txid, where }) {
  // Update everytime a new block is received
  const unsubscribe = getStore().observe(
    ({ core: { info } }) => info?.blocks,
    async (blocks) => {
      if (!blocks) return;
      const tx = await fetchTransaction({ txid, where });
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
        watchIfUnconfirmed(transactions);

        transactions.forEach((tx) => {
          const changes = getBalanceChanges(tx);
          if (changes.length) {
            const changeLines = changes.map(
              (change) =>
                `${change.amount >= 0 ? '+' : ''}${formatNumber(
                  change.amount
                )} ${TokenName.from({ contract: change })}`
            );
            if (tx.confirmations <= 5) {
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
          }
        });
      }
    }
  );
}
