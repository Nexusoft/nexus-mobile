import * as TYPE from 'consts/actionTypes';
import { sendAPI } from 'lib/api';
import { getStore } from 'store';

export const selectLoggedIn = (state) => !!state.user.status;

export async function refreshUserStatus() {
  const store = getStore();
  try {
    const status = await sendAPI('users/get/status');
    store.dispatch({ type: TYPE.SET_USER_STATUS, payload: status });
    return status;
  } catch (err) {
    store.dispatch({ type: TYPE.LOGOUT });
  }
}

export async function refreshUserBalances() {
  const store = getStore();
  try {
    const balances = await sendAPI('finance/get/balances');
    store.dispatch({ type: TYPE.SET_USER_BALANCES, payload: balances });
    return balances;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_BALANCES });
  }
}

export async function refreshUserAccounts() {
  const store = getStore();
  try {
    const accounts = await sendAPI('users/list/accounts');
    store.dispatch({ type: TYPE.SET_USER_ACCOUNTS, payload: accounts });
    return accounts;
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_ACCOUNTS });
  }
}

export function setupUser(store) {
  store.observe(
    (state) => state.core.info,
    (coreInfo) => {
      if (coreInfo) {
        refreshUserStatus();
      }
    }
  );

  store.observe(
    (state) => state.user.status,
    (userStatus) => {
      if (userStatus) {
        refreshUserAccounts();
      }
    }
  );
}

export async function login({ username, password, pin }) {
  await sendAPI('users/login/user', { username, password, pin });
  await refreshUserStatus();
}

export async function logout() {
  await sendAPI('users/logout/user');
  await refreshUserStatus();
}
