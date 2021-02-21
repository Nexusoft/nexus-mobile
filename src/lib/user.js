import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { updateSettings } from 'lib/settings';
import { getStore } from 'store';

// Store Selects

export const selectLoggedIn = (state) => !!state.user.status;

// Return user's confirmed status
export const selectUserIsConfirmed = (state) => state.user?.status?.confirmed;

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
    if (accounts.length === 0) {
      // In a very rare case the sigchain is not fully downloaded, try again
      setTimeout(refreshUserAccounts, 500);
    }

    return accounts;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_ACCOUNTS });
    return null;
  }
}

export async function refreshUserSync() {
  try {
    const result = await callAPI('ledger/sync/sigchain');
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

export async function login({
  username,
  password,
  pin,
  rememberMe,
  keepLoggedIn,
}) {
  await callAPI('users/login/user', { username, password, pin });
  updateSettings({
    savedUsername: rememberMe ? username : null,
  });
  await Promise.all([
    callAPI('users/unlock/user', { pin, notifications: true }),
    refreshUserStatus(),
    rememberMe && keepLoggedIn ? callAPI('users/save/session', { pin }) : null,
  ]);
}

export async function logout() {
  await callAPI('users/logout/user');
  await refreshUserStatus();
}

export function setRegistrationTxids({ username, txid }) {
  getStore().dispatch({
    type: TYPE.SET_REGISTRATION_TXID,
    payload: { username, txid },
  });
}
