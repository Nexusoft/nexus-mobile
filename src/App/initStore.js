import { refreshCoreInfo } from 'lib/coreInfo';
import {
  refreshUserAccounts,
  refreshUserBalances,
  refreshUserSync,
  selectLoggedIn,
} from 'lib/user';
import { refreshUserStatus } from 'lib/session';
import { watchNewTransactions } from 'lib/transactions';
import { watchPaymentLinks } from 'lib/paymentLinks';
import { watchAppLock, lockOnStart } from 'lib/appLock';
import { pollMarketPrice } from 'lib/market';
import { selectSetting } from 'lib/settings';
import { loadEmbeddedCredentials } from 'lib/embeddedCore';
import { createStore } from 'store';
import loadInitialState from 'store/loadInitialState';

function withTimeout(action, timeout) {
  const promise = new Promise((resolve) => {
    action()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(null);
      });
  });
  return Promise.race([
    promise,
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, timeout)
    ),
  ]);
}

export default function initStore() {
  return new Promise(async (resolve) => {
    // Load initialState here to avoid circular dependencies
    const initialState = await loadInitialState();
    const store = createStore(initialState);
    if (selectSetting('coreMode')(store.getState()) === 'embedded') {
      await loadEmbeddedCredentials();
    }
    await withTimeout(refreshCoreInfo, 1000);

    let startChecked = false;
    store.observe(
      (state) => state.core.info,
      async (coreInfo) => {
        if (coreInfo) {
          await refreshUserStatus();
          if (!startChecked) {
            startChecked = true;
            lockOnStart();
          }
        }
        resolve();
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

    //lite core: after login, indexing or header sync, fetch history the core may have skipped
    store.observe(
      (state) =>
        selectLoggedIn(state) &&
        !state.user.status?.indexing &&
        !state.core.info?.syncing &&
        state.user.status.genesis,
      async (readyGenesis) => {
        if (readyGenesis && (await refreshUserSync())) {
          refreshUserAccounts();
          refreshUserBalances();
        }
      }
    );

    watchNewTransactions();
    watchPaymentLinks();
    watchAppLock();
    pollMarketPrice();
  });
}
