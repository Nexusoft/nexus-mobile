import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getStore } from 'store';

// Store Selects

export const selectLoggedIn = (state) => !!state.user.status?.genesis;

// Return user's confirmed status
export const selectUserIsConfirmed = (state) =>
  state.user?.status?.confirmed !== false;

export const selectUsername = (state) => {
  const {
    user: { status, profileStatus },
  } = state;

  return profileStatus?.session?.username || status?.username || '';
};

// Refreshes

export async function refreshUserBalances() {
  const store = getStore();
  try {
    const balances = await callAPI('finance/get/balances');
    store.dispatch({ type: TYPE.SET_USER_BALANCES, payload: balances });
    return balances;
  } catch (err) {
    return null;
  }
}

export async function refreshUserAccounts() {
  const store = getStore();
  try {
    const accounts = await callAPI('finance/list/any');
    if (!accounts?.length) {
      // In a very rare case the sigchain is not fully downloaded, try again
      setTimeout(refreshUserAccounts, 500);
    }
    store.dispatch({ type: TYPE.SET_USER_ACCOUNTS, payload: accounts });
    return accounts;
  } catch (err) {
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
    const account = await callAPI('finance/get/any', { address });
    store.dispatch({
      type: TYPE.SET_USER_ACCOUNT,
      payload: { address, account },
    });
    return account;
  } catch (err) {
    return null;
  }
}
