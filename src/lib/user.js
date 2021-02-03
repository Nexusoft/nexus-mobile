import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getStore } from 'store';

//Store Selects

export const selectLoggedIn = (state) => !!state.user.status;

// Return true if user is logged in but not confirmed
export const selectUserIsUnconfirmed = (state) => {
  const txs = Object.values(state.transactions.txMap);
  const genesisTx = txs.find((tx) => tx.type === 'tritium first');
  return !!genesisTx?.confirmations;
};

// Refreshes

export async function refreshUserStatus() {
  const store = getStore();
  try {
    const status = await callAPI('users/get/status');
    store.dispatch({ type: TYPE.SET_USER_STATUS, payload: status });
    return status;
  } catch (err) {
    store.dispatch({ type: TYPE.LOGOUT });
    return null;
  }
}

export async function refreshUserBalances() {
  const store = getStore();
  try {
    const balances = await callAPI('finance/get/balances');
    store.dispatch({ type: TYPE.SET_USER_BALANCES, payload: balances });
    return balances;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_BALANCES });
    return null;
  }
}

export async function refreshUserAccounts() {
  const store = getStore();
  try {
    const accounts = await callAPI('users/list/accounts');
    store.dispatch({ type: TYPE.SET_USER_ACCOUNTS, payload: accounts });
    return accounts;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_ACCOUNTS });
    return null;
  }
}

export async function refreshUserSync() {
  try {
    const result = await callAPI('ledger/sync/sigchain');
    console.log(result);
    return result;
  } catch (err) {
    return null;
  }
}

export async function refreshHeaders() {
  try {
    const result = await callAPI('ledger/sync/headers');
    return result;
  } catch (error) {
    if (error.code === '-306') {
      setTimeout(() => {
        refreshHeaders();
      }, 500);
    }
  }
}

export async function refreshUserAccount(address) {
  const store = getStore();
  try {
    const account = await callAPI('finance/get/account', { address });
    store.dispatch({
      type: TYPE.SET_USER_ACCOUNT,
      payload: { address, account },
    });
    return account;
  } catch (err) {
    return null;
  }
}

// Functions

export async function login({ username, password, pin }) {
  await callAPI('users/login/user', { username, password, pin });
  await refreshUserStatus();
}

export async function logout() {
  await callAPI('users/logout/user');
  await refreshUserStatus();
}
