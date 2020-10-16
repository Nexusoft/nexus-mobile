import { AsyncStorage } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';
import memoize from 'utils/memoize';

export const defaultSettings = {
  // Application
  colorScheme: 'auto', // auto | light | dark
  baseCurrency: 'USD',

  // Core
  coreMode: 'embedded',
  externalCoreIP: '127.0.0.1',
  externalCoreAPIPort: '8080',
  externalCoreAPIUser: 'apiserver',
  externalCoreAPIPassword: 'password',
};

export async function loadSettings() {
  const keys = Object.keys(defaultSettings);
  const results = await AsyncStorage.multiGet(keys);
  const settings = results.reduce((settings, [key, value]) => {
    settings[key] = value && JSON.parse(value);
    return settings;
  }, {});
  return settings;
}

export async function updateSettings(updates) {
  if (updates) {
    const store = getStore();
    store.dispatch({
      type: TYPE.UPDATE_SETTINGS,
      payload: updates,
    });

    const keyValuePairs = Object.entries(updates).map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    try {
      return await AsyncStorage.multiSet(keyValuePairs);
    } catch (err) {
      console.error(err);
    }
  }
}

export const selectSettings = memoize(
  (state) =>
    state &&
    Object.entries(state.settings).reduce((settings, [key, value]) => {
      settings[key] =
        value === null || value === undefined ? defaultSettings[key] : value;
      return settings;
    }, {})
);
