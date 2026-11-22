import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { getStore } from 'store';

// Store Selects

export const selectLoggedIn = (state) => !!state.user.status?.genesis;

// Return user's confirmed status
export const selectUserIsConfirmed = (state) =>
  state.user?.profileStatus?.confirmed !== false;

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

let emptyAccountRetries = 0;
export async function refreshUserAccounts() {
  const store = getStore();
  try {
    const accounts = await callAPI('finance/list/any');
    //sigchain not fully downloaded yet, try again a few times
    if (!accounts?.length && emptyAccountRetries < 20) {
      emptyAccountRetries++;
      setTimeout(() => {
        if (selectLoggedIn(store.getState())) refreshUserAccounts();
      }, 1000);
    } else {
      emptyAccountRetries = 0;
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

const maxSigchainSyncRounds = 10;
let sigchainSync = null;

async function readTransactionCount() {
  const status = await callAPI('profiles/status/master');
  return status?.transactions;
}

//lite core only, a full node keeps the sigchain current by itself
//core 5.1 has no ledger/sync/*, profiles/transactions downloads what is missing first
//the core can stop a download early (peer dropped), so go on while it still brings new ones
async function syncSigchain() {
  let added = false;
  let count = await readTransactionCount();
  for (let round = 0; round < maxSigchainSyncRounds; round++) {
    await callAPI('profiles/transactions', { limit: 1 });
    const newCount = await readTransactionCount();
    if (!(newCount > count)) break;
    added = true;
    count = newCount;
  }
  return added;
}

//resolves true when older transactions came in
export function refreshUserSync() {
  const state = getStore().getState();
  if (!state.core.info?.litemode || !selectLoggedIn(state)) {
    return Promise.resolve(false);
  }
  if (!sigchainSync) {
    sigchainSync = syncSigchain()
      .catch(() => false)
      .finally(() => {
        sigchainSync = null;
      });
  }
  return sigchainSync;
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
