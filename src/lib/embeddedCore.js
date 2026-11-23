import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

import { updateSettings } from 'lib/settings';

const confPath = () =>
  (Platform.OS === 'android'
    ? RNFS.ExternalDirectoryPath
    : RNFS.DocumentDirectoryPath) + '/Nexus/nexus.conf';

export function parseConf(text) {
  const values = {};
  for (const line of (text || '').split(/\r?\n/)) {
    const index = line.indexOf('=');
    if (index > 0) {
      values[line.slice(0, index).trim()] = line.slice(index + 1).trim();
    }
  }
  return values;
}

//the core writes a new api password each time it starts
export async function loadEmbeddedCredentials() {
  try {
    const { apiuser, apipassword } = parseConf(
      await RNFS.readFile(confPath(), 'utf8')
    );
    if (apiuser && apipassword) {
      await updateSettings({
        embeddedUser: apiuser,
        embeddedPassword: apipassword,
      });
      return true;
    }
  } catch (err) {
    console.warn('nexus.conf not readable yet', err?.message);
  }
  return false;
}
