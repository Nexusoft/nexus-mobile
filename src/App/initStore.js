import { refreshCoreInfo } from 'lib/coreInfo';
import { refreshUserStatus, setupUser } from 'lib/user';
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

export default async function initStore() {
  // Load initialState here to avoid circular dependencies
  const initialState = await loadInitialState();
  createStore(initialState);

  const coreInfo = await withTimeout(refreshCoreInfo, 1000);
  setupUser();

  if (coreInfo) {
    await withTimeout(refreshUserStatus, 1000);
  }
}
