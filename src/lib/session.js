import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { updateSettings } from 'lib/settings';
import { getStore } from 'store';
import { disableBiometricUnlock } from 'lib/biometric';

const maxIndexingWaitMs = 180000;

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
    //timeouts and other passing errors keep the current state, only a lost session logs out
    if (err?.code !== -11) {
      console.error('refresh status', err);
      return null;
    }
    const {
      settings: { savedUsername },
    } = store.getState();
    let saved = false;
    if (savedUsername) {
      try {
        saved = !!(
          await callAPI('sessions/status/local', { username: savedUsername })
        )?.saved;
      } catch (err) {
        saved = false;
      }
    }
    store.dispatch({ type: TYPE.SET_SESSION_SAVED, payload: saved });
    store.dispatch({ type: TYPE.LOGOUT });
    return null;
  }
}

// Functions

//core error codes and network failures in plain words
export function friendlyLoginError(err) {
  const syncing = !!getStore()?.getState().core.info?.syncing;
  const syncNote = syncing
    ? ' Nexus Core is still synchronizing, which can also cause this. Wait for it to finish and try again.'
    : '';
  switch (err?.code) {
    case -139:
      return 'Wrong username, password or PIN.' + syncNote;
    case -130:
      return 'No account with this username was found.' + syncNote;
    case -309:
      return 'Wrong PIN, or the saved login could not be opened.';
    case 'TIMEOUT':
    case 'NETWORK':
    case 401:
      return err.message;
    default:
      return (err?.message || 'Login failed') + syncNote;
  }
}

//wait for the sigchain download and indexing...
export async function waitForIndexing() {
  const indexingDeadline = Date.now() + maxIndexingWaitMs;
  while (true) {
    const status = await callAPI('sessions/status/local');
    if (!status?.indexing) return;
    //very large sigchains: go on, balances fill in when indexing ends
    if (Date.now() > indexingDeadline) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

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
    await waitForIndexing();
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
      settings: { savedUsername },
    } = store.getState();

    await callAPI('sessions/terminate/local', saved ? { clear: 1 } : null);
    if (saved) await disableBiometricUnlock(savedUsername);
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
