import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { updateSettings } from 'lib/settings';
import { getStore } from 'store';

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
