import { AsyncStorage } from "react-native";

export const defaultSettings = {
  darkMode: true,
};

export async function loadSettings() {
  const keys = Object.keys(defaultSettings);
  const results = await AsyncStorage.multiGet(keys);
  return results.reduce((settings, [key, value]) => {
    settings[key] =
      value === null || value === undefined ? defaultSettings[key] : value;
  }, {});
}

export async function updateSettings(updates) {
  if (updates) {
    return await AsyncStorage.multiSet(Object.entries(updates));
  }
}
