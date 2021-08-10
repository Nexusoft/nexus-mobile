import { scheduleNotificationAsync } from 'expo-notifications';

import TokenName from 'components/TokenName';
import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getDeltaSign } from 'lib/contracts';
import { refreshUserAccounts } from 'lib/user';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

export const isConfirmed = (tx) => !!tx.confirmations;

let watchedIds = [];
let unsubscribe = null;
function startWatcher() {
  unsubscribe = observeStore(
    (state) => state,
    async (state, oldState) => {
      // Clear watcher if user is logged out or core is disconnected or user is switched
      const genesis = state.user.status?.genesis;
      const oldGenesis = oldState.user.status?.genesis;
      if (!isLoggedIn(state) || genesis !== oldGenesis) {
        unsubscribe?.();
        unsubscribe = null;
        watchedIds = [];
      }

      // Only refetch transaction each time there is a new block
      const blocks = state.core.info?.blocks;
      const oldBlocks = oldState.core.info?.blocks;
      if (!blocks || blocks === oldBlocks) return;

      // Fetch the updated transaction info
      const transactions = await Promise.all([
        watchedIds.map((txid) => fetchTransaction({ txid })),
      ]);

      for (const tx of transactions) {
        if (isConfirmed(tx)) {
          unwatchTransaction(tx.txid);
          // Reload the account list
          // so that the account balances (available & unconfirmed) are up-to-date
          refreshUserAccounts();
        }
      }
    }
  );
}

function watchTransaction(txid) {
  if (!watchedIds.includes(txid)) {
    watchedIds.push(txid);
  }
  if (!unsubscribe) {
    startWatcher();
  }
}

function unwatchTransaction(txid) {
  watchedIds = watchedIds.filter((id) => id !== txid);
  if (!watchedIds.length) {
    unsubscribe?.();
    unsubscribe = null;
  }
}

function watchIfUnconfirmed(transactions) {
  transactions?.forEach((tx) => {
    if (!isConfirmed(tx)) {
      watchTransaction(tx.txid);
    }
  });
}

function buildQuery({ accountQuery, tokenQuery, operation, timeSpan }) {
  const queries = [];
  if (timeSpan) {
    const pastDate = getThresholdDate(timeSpan);
    if (pastDate) {
      queries.push(`object.timespan>${pastDate.getTime() / 1000}`);
    }
  }
  if (operation) {
    queries.push(`object.contracts.OP=${operation}`);
  }
  if (tokenQuery) {
    const buildTokenQuery = (field) =>
      `object.contracts.${field}=*${tokenQuery}*`;
    const tokenQueries = [
      buildTokenQuery('token'),
      buildTokenQuery('token_name'),
    ];
    queries.push(`(${tokenQueries.join(' OR ')})`);
  }
  if (accountQuery) {
    const buildAccountQuery = (field) =>
      `object.contracts.${field}=*${accountQuery}*`;
    const accountQueries = [
      buildAccountQuery('from'),
      buildAccountQuery('from_name'),
      buildAccountQuery('to'),
      buildAccountQuery('to_name'),
      buildAccountQuery('account'),
      buildAccountQuery('account_name'),
      buildAccountQuery('destination'),
      buildAccountQuery('address'),
    ];
    queries.push(`(${accountQueries.join(' OR ')})`);
  }

  return queries.join(' AND ') || undefined;
}

const txCountPerPage = 20;
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
    const params = {
      verbose: 'summary',
      limit: txCountPerPage,
      offset,
    };
    const query = buildQuery(transactionsFilter);
    if (query) {
      params.where = query;
    }
    const transactions = await callAPI('users/list/transactions', params);
    store.dispatch({
      type: TYPE.FETCH_TXS_RESULT,
      payload: {
        reload,
        transactions,
        loadedAll: transactions.length < txCountPerPage,
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

const getThresholdDate = (timeSpan) => {
  const now = new Date();
  switch (timeSpan) {
    case 'week':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case 'year':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return null;
  }
};

function filterTransactions(transactions) {
  const {
    ui: {
      transactionsFilter: { accountQuery, tokenQuery, operation, timeSpan },
    },
    user: {
      transactions: { loading, loaded },
    },
  } = getStore().getState();
  if (loading || loaded === 'none' || !transactions) return [];

  return transactions.filter((tx) => {
    if (timeSpan) {
      const pastDate = getThresholdDate(timeSpan);
      if (pastDate && tx.timestamp * 1000 < pastDate.getTime()) {
        return false;
      }
    }
    if (
      operation &&
      !tx.contracts.some((contract) => contract.OP === operation)
    ) {
      return false;
    }
    if (
      accountQuery &&
      !tx.contracts.some(
        (contract) =>
          contract.from_name?.includes(accountQuery) ||
          contract.from?.includes(accountQuery) ||
          contract.to_name?.includes(accountQuery) ||
          contract.to?.includes(accountQuery) ||
          contract.account_name?.includes(accountQuery) ||
          contract.account?.includes(accountQuery) ||
          contract.destination?.includes(accountQuery) ||
          contract.address?.includes(accountQuery)
      )
    ) {
      return false;
    }
    if (
      tokenQuery &&
      !tx.contracts.some(
        (contract) =>
          contract.token_name?.includes(tokenQuery) ||
          contract.token?.includes(tokenQuery)
      )
    ) {
      return false;
    }

    return true;
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

export function updateFilter(updates) {
  getStore().dispatch({
    type: TYPE.UPDATE_TRANSACTIONS_FILTER,
    payload: updates,
  });
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

        const filteredTransactions = filterTransactions(transactions);
        if (filteredTransactions.length) {
          getStore().dispatch({
            type: TYPE.ADD_TRANSACTIONS,
            payload: filteredTransactions,
          });
          watchIfUnconfirmed(filteredTransactions);
        }
      }
    }
  );
}
