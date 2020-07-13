import { AsyncStorage } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';

export const defaultSettings = {
  darkMode: false,
  baseCurrency: 'USD',
  coreMode: 'embedded',
};

export async function loadSettings() {
  const keys = Object.keys(defaultSettings);
  const results = await AsyncStorage.multiGet(keys);
  const settings = results.reduce((settings, [key, value]) => {
    settings[key] =
      value === null || value === undefined
        ? defaultSettings[key]
        : JSON.parse(value);
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
