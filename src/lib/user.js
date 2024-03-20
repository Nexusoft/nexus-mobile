import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { updateSettings } from 'lib/settings';
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

// Don't refresh user status while login process is not yet done
let refreshUserStatusLock = false;
export async function refreshUserStatus() {
  if (refreshUserStatusLock) return;

  const store = getStore();
  try {
    const status = await callAPI('sessions/status/local');

    // if (store.getState().user.profileStatus?.genesis !== status.genesis) {
    const profileStatus = await callAPI('profiles/status/master', {
      genesis: status.genesis,
    });
    store.dispatch({
      type: TYPE.SET_PROFILE_STATUS,
      payload: profileStatus,
    });
    // }

    // let recovery = store.getState()?.user?.status?.recovery;
    // if (!recovery) {
    //   //Limit API calls
    //   const profStatus = await callAPI('profiles/status/master');
    //   recovery = profStatus.recovery;
    // }
    store.dispatch({
      type: TYPE.SET_USER_STATUS,
      payload: status,
    });
    return status;
  } catch (err) {
    // Don't log "Session not found" errors
    if (err?.code !== -11) {
      console.error('refresh status', err);
    }
    try {
      const {
        settings: { savedUsername },
      } = store.getState();
      if (savedUsername) {
        const { saved } = await callAPI('sessions/status/local', {
          username: savedUsername,
        });
        if (saved) {
          store.dispatch({ type: TYPE.SET_SESSION_SAVED, payload: true });
        }
      }
    } catch (err) {
      if (err?.code === -11) {
        // Error code -11 "Session not found"
        store.dispatch({ type: TYPE.SET_SESSION_SAVED, payload: false });
        return null;
      } else {
        console.error(err);
      }
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

// Functions

export async function logIn({
  username,
  password,
  pin,
  rememberMe,
  keepLoggedIn,
}) {
  // Stop refreshing user status
  refreshUserStatusLock = true;
  try {
    const { genesis } = await callAPI('sessions/create/local', {
      username,
      password,
      pin,
    });
    let finishedIndexing = false;
    while (!finishedIndexing) {
      // This checks if the account has finished indexing after downloading the sigchain, consider revising this.
      let status = await callAPI('sessions/status/local');
      finishedIndexing = !status.indexing;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    updateSettings({
      savedUsername: rememberMe ? username : null,
    });
    const [status, profileStatus] = await Promise.all([
      callAPI('sessions/status/local'),
      callAPI('profiles/status/master', { genesis }),
      callAPI('sessions/unlock/local', { pin, notifications: true }),
      rememberMe && keepLoggedIn
        ? callAPI('sessions/save/local', { pin })
        : null,
    ]);
    getStore().dispatch({
      type: TYPE.ACTIVE_USER,
      payload: {
        status,
        profileStatus,
      },
    });
  } finally {
    // Release the lock
    refreshUserStatusLock = false;
  }
}

export async function logOut() {
  // Stop refreshing user status
  refreshUserStatusLock = true;
  try {
    const store = getStore();
    const {
      user: {
        status: { saved },
      },
    } = store.getState();

    await callAPI('sessions/terminate/local', saved ? { clear: 1 } : null);
  } finally {
    // Release the lock
    refreshUserStatusLock = false;
  }
  await refreshUserStatus();
}

export function setRegistrationTxids({ username, txid }) {
  getStore().dispatch({
    type: TYPE.SET_REGISTRATION_TXID,
    payload: { username, txid },
  });
}
