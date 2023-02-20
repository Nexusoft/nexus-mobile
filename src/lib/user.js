import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { updateSettings } from 'lib/settings';
import { getStore } from 'store';

// Store Selects

export const selectLoggedIn = (state) => !!state.user.status.genesis;

// Return user's confirmed status
export const selectUserIsConfirmed = (state) =>
  state.user?.status?.confirmed !== false;

// Refreshes

export async function refreshUserStatus() {
  const store = getStore();
  try {
    const status = await callAPI('sessions/status/local');
    store.dispatch({ type: TYPE.SET_USER_STATUS, payload: status });
    return status;
  } catch (err) {
    try {
      const {
        settings: { savedUsername },
      } = store.getState();
      if (savedUsername) {
        const { has } = await callAPI('sessions/status/local', {
          username: savedUsername,
        });
        if (has) {
          store.dispatch({ type: TYPE.OPEN_UNLOCK_SCREEN });
          // await callAPI('users/load/session', { username: savedUsername });
        }
      }
    } catch (err) {
      if (err.code == -11) { // If session is not found, then removed the saved user name. 
        updateSettings({ savedUsername: null });
        return null;
      }
      console.error(err);
    }
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
    const [trust, accounts] = await Promise.all([
      callAPI('finance/list/trust'),
      callAPI('finance/list/account'),
    ]);
    if (!accounts?.length && !trust.length) {
      // In a very rare case the sigchain is not fully downloaded, try again
      setTimeout(refreshUserAccounts, 500);
    }

    const allAccounts = trust.concat(accounts);
    store.dispatch({ type: TYPE.SET_USER_ACCOUNTS, payload: allAccounts });
    return allAccounts;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_ACCOUNTS });
    return null;
  }
}

export async function refreshUserTokens() {
  const store = getStore();
  try {
    const tokens = await callAPI('finance/list/tokens');
    store.dispatch({ type: TYPE.SET_USER_TOKENS, payload: tokens });
    return tokens;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_TOKENS });
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
    let account = null;
    try {
      account = await callAPI('finance/get/account', { address });
    } catch (err) {
      account = await callAPI('finance/get/trust', { address });
    }
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
  await callAPI('sessions/create/local', { username, password, pin });
  let finishedIndexing = false;
  while (!finishedIndexing) { // This checks if the account has finished indexing after downloading the sigchain, consider revising this. 
    let status = await callAPI('sessions/status/local');
    finishedIndexing = !status.indexing;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  getStore().dispatch({
    type: TYPE.SET_USERNAME,
    payload: { username },
  });
  updateSettings({
    savedUsername: rememberMe ? username : null,
  });
  await Promise.all([
    callAPI('sessions/unlock/local', { pin, notifications: true }),
    refreshUserStatus(),
    rememberMe && keepLoggedIn ? callAPI('sessions/save/local', { pin }) : null,
  ]);
}

export async function logout() {
  await callAPI('sessions/terminate/local');
  await refreshUserStatus();
}

export function setRegistrationTxids({ username, txid }) {
  getStore().dispatch({
    type: TYPE.SET_REGISTRATION_TXID,
    payload: { username, txid },
  });
}
