import * as TYPE from 'consts/actionTypes';
import { sendAPI } from 'lib/api';
import { getStore } from 'store';

export const selectLoggedIn = (state) => !!state.user.status;

export async function refreshUserStatus() {
  const store = getStore();
  try {
    const status = await sendAPI('users/get/status');
    store.dispatch({ type: TYPE.SET_USER_STATUS, payload: status });
    getStakeInfo();
  } catch (err) {
    store.dispatch({ type: TYPE.CLEAR_USER_STATUS });
  }
}

export function setupUser() {
  getStore().observe(
    (state) => state.core.info,
    (coreInfo) => {
      if (coreInfo) {
        refreshUserStatus();
      }
    }
  );
}
