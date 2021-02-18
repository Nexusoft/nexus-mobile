import { encode } from 'base-64';

import { getStore } from 'store';
import { selectSetting } from 'lib/settings';

function getConfig() {
  const state = getStore().getState();
  const coreMode = selectSetting('coreMode')(state);
  if (coreMode === 'embedded') {
    const embeddedUser = selectSetting('embeddedUser')(state);
    const embeddedPassword = selectSetting('embeddedPassword')(state);
    return {
      ip: 'localhost',
      port: '8080',
      user: embeddedUser,
      password: embeddedPassword,
    };
  } else {
    const externalCoreIP = selectSetting('externalCoreIP')(state);
    const externalCoreAPIPort = selectSetting('externalCoreAPIPort')(state);
    const externalCoreAPIUser = selectSetting('externalCoreAPIUser')(state);
    const externalCoreAPIPassword = selectSetting('externalCoreAPIPassword')(
      state
    );
    return {
      ip: externalCoreIP,
      port: externalCoreAPIPort,
      user: externalCoreAPIUser,
      password: externalCoreAPIPassword,
    };
  }
}

export async function callAPI(endpoint, params) {
  const config = getConfig();
  const baseUrl = `http://${config.ip}:${config.port}`;
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + encode(`${config.user}:${config.password}`),
    },
    body: params && JSON.stringify(params),
  });
  const content = await response.json();
  if (response.ok) {
    return content?.result;
  } else {
    throw content?.error;
  }
}
