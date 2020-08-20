import { refreshCoreInfo } from 'lib/coreInfo';
import { refreshUserStatus, refreshUserAccounts } from 'lib/user';
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
    await withTimeout(refreshCoreInfo, 1000);

    store.observe(
      (state) => state.core.info,
      async (coreInfo) => {
        if (coreInfo) {
          await refreshUserStatus();
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
  });
}
