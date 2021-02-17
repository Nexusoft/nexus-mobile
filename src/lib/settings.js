import { AsyncStorage } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';
import memoize from 'utils/memoize';

export const defaultSettings = {
  // Application
  colorScheme: 'auto', // auto | light | dark
  baseCurrency: 'USD',
  hideBalances: false,

  // Core
  coreMode: 'embedded',
  embeddedUser: 'apiserver',
  embeddedPassword: 'password',
  externalCoreIP: '127.0.0.1',
  externalCoreAPIPort: '8080',
  externalCoreAPIUser: 'apiserver',
  externalCoreAPIPassword: 'password',

  // Hidden
  showContactsTip: true,
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
    const settings = store.getState().settings;

    const keyValuePairs = Object.entries(settings).map(([key, value]) => [
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

export const selectSetting = (key) => (state) => {
  const value = state?.settings?.[key];
  return value === null || value === undefined ? defaultSettings[key] : value;
};

export const selectSettings = (keys) =>
  memoize(
    (userSettings) =>
      userSettings &&
      keys.reduce((settings, key) => {
        const value = userSettings[key];
        settings[key] =
          value === null || value === undefined ? defaultSettings[key] : value;
        return settings;
      }, {}),
    (state) => [state?.settings]
  );

export const selectAllSettings = memoize(
  (userSettings) =>
    userSettings &&
    Object.keys(defaultSettings).reduce((settings, key) => {
      const value = userSettings[key];
      settings[key] =
        value === null || value === undefined ? defaultSettings[key] : value;
      return settings;
    }, {}),
  (state) => [state?.settings]
);
