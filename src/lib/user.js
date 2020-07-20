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
    store.dispatch({ type: TYPE.CLEAR_USER_STATUS });
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
}

export async function login({ username, password, pin }) {
  await sendAPI('users/login/user', { username, password, pin });
  await refreshUserStatus();
}

export async function logout() {
  const result = await sendAPI('users/logout/user');
  if (result?.success) {
    store.dispatch({ type: TYPE.CLEAR_USER_STATUS });
  }
}
