import { scheduleNotificationAsync } from 'expo-notifications';

import TokenName from 'components/TokenName';
import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getDeltaSign } from 'lib/contracts';
import { refreshUserAccounts, selectLoggedIn } from 'lib/user';
import { getStore, observeStore } from 'store';
import { showError } from 'lib/ui';
import { t } from 'lib/i18n';
import formatNumber from 'utils/formatNumber';

//a history download can add hundreds at once, older ones are not news
const maxNewTransactionsFetch = 20;

export const isConfirmed = (tx) => !!tx.confirmations;

export const quickFilters = [
  { label: 'All', ops: null },
  { label: 'Sent', ops: ['DEBIT', 'LEGACY', 'FEE'] },
  { label: 'Received', ops: ['CREDIT', 'COINBASE', 'MIGRATE'] },
  { label: 'Staking', ops: ['TRUST', 'GENESIS'] },
];

let watchedIds = [];
let unsubscribe = null;
function startWatcher() {
  unsubscribe = observeStore(
    (state) => state,
    async (state, oldState) => {
      // Clear watcher if user is logged out or core is disconnected or user is switched
      const genesis = state.user.status?.genesis;
      const oldGenesis = oldState.user.status?.genesis;
      if (!oldState) return;
      if (!selectLoggedIn(state) || genesis !== oldGenesis) {
        unsubscribe?.();
        unsubscribe = null;
        watchedIds = [];
        return;
      }

      // Only refetch transaction each time there is a new block
      const blocks = state.core.info?.blocks;
      const oldBlocks = oldState.core.info?.blocks;
      if (!blocks || blocks === oldBlocks) return;

      // Fetch the updated transaction info
      const transactions = await Promise.all(
        watchedIds.map((txid) => fetchTransaction({ txid }).catch(() => null))
      );

      for (const tx of transactions) {
        if (tx && isConfirmed(tx)) {
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

function buildQuery({ addressQuery, operation, timeSpan }) {
  const queries = [];
  if (timeSpan) {
    const pastDate = getThresholdDate(timeSpan);
    if (pastDate) {
      //no leading zeros, the core reads 08 and 09 as bad octal numbers
      const day = `${pastDate.getUTCFullYear()}-${pastDate.getUTCMonth() + 1}-${pastDate.getUTCDate()}`;
      queries.push(`results.timestamp>date(\`${day}\`);`);
    }
  }
  if (operation) {
    const ops = Array.isArray(operation) ? operation : [operation];
    const opQuery = ops.map((op) => `results.contracts.OP=${op}`).join(' OR ');
    queries.push(ops.length > 1 ? `(${opQuery})` : opQuery);
  }
  if (addressQuery) {
    const buildAddressQuery =
      addressQuery === '0'
        ? (field) => `results.contracts.${field}.address=0`
        : (field) => `results.contracts.${field}.address=*${addressQuery}*`;
    const addressQueries = [
      buildAddressQuery('token'),
      buildAddressQuery('from'),
      buildAddressQuery('to'),
      buildAddressQuery('account'),
      buildAddressQuery('destination'),
      buildAddressQuery('address'),
    ];
    queries.push(`(${addressQueries.join(' OR ')})`);
  }

  return queries.join(' AND ') || undefined;
}

const txCountPerPage = 50;
let txRequestSeq = 0;
export async function loadTransactions({ reload } = { reload: false }) {
  const store = getStore();
  const {
    user: {
      transactions: { transactions: currentTransactions, loading },
    },
    ui: { transactionsFilter },
  } = store.getState();
  if (loading && !reload) return;

  const offset = reload ? 0 : currentTransactions.length;
  const seq = ++txRequestSeq;
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
    let transactions;
    try {
      transactions = await callAPI('profiles/transactions/master', params);
    } catch (err) {
      if (seq === txRequestSeq) {
        showError(err?.message || t('Could not load transactions'));
      }
      return;
    }
    //a newer load (filter change) started meanwhile
    if (seq !== txRequestSeq) return;
    store.dispatch({
      type: TYPE.FETCH_TXS_RESULT,
      payload: {
        offset,
        reload,
        transactions,
        loadedAll: transactions.length < txCountPerPage,
      },
    });
    watchIfUnconfirmed(transactions);
  } finally {
    if (seq === txRequestSeq) {
      store.dispatch({
        type: TYPE.STOP_FETCHING_TXS,
      });
    }
  }
}

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
      transactionsFilter: { addressQuery, operation, timeSpan },
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
    const ops = operation
      ? Array.isArray(operation)
        ? operation
        : [operation]
      : null;
    if (ops && !tx.contracts.some((contract) => ops.includes(contract.OP))) {
      return false;
    }
    if (addressQuery) {
      if (addressQuery === '0') {
        if (!tx.contracts.some((contract) => contract.token === '0')) {
          return false;
        }
      } else {
        if (
          !tx.contracts.some(
            (contract) =>
              contract.token?.includes(addressQuery) ||
              contract.from?.includes(addressQuery) ||
              contract.to?.includes(addressQuery) ||
              contract.account?.includes(addressQuery) ||
              contract.destination?.includes(addressQuery) ||
              contract.address?.includes(addressQuery)
          )
        ) {
          return false;
        }
      }
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
            contract.ticker || contract.token_name
              ? (change) =>
                  change.ticker === (contract.ticker || contract.token_name)
              : (change) => change.token === contract.token
          );
          if (change) {
            change.amount =
              change.amount + (sign === '-' ? -1 : 1) * contract.amount;
          } else {
            change = {
              ticker: contract.ticker || contract.token_name,
              token: contract.token,
              amount: (sign === '-' ? -1 : 1) * contract.amount,
            };
            changes.push(change);
          }
        }
        return changes;
      }, [])
    : [];

export async function fetchTransaction({ txid, where, limit }) {
  let tx;
  if (where) {
    const txs = await callAPI('ledger/list/transactions', {
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
      //core 5.1 has the count in profiles/status, not sessions/status
      const txCount = state?.user?.profileStatus?.transactions;
      const oldTxCount = oldState?.user?.profileStatus?.transactions;
      const wasSyncing = !!oldState?.core?.info?.syncing;
      if (
        txCount > oldTxCount &&
        typeof txCount === 'number' &&
        typeof oldTxCount === 'number' &&
        !wasSyncing
      ) {
        let transactions;
        try {
          transactions = await callAPI('ledger/list/transactions', {
            verbose: 'summary',
            limit: Math.min(txCount - oldTxCount, maxNewTransactionsFetch),
          });
        } catch (err) {
          return;
        }
        if (!Array.isArray(transactions)) return;

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
                  title: t('New transaction'),
                  body: changeLines.join(' \n'),
                  data: { type: 'new_transaction', txid: tx.txid },
                },
                trigger: { channelId: 'transaction-channel-id' },
              }).catch(() => {});
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
