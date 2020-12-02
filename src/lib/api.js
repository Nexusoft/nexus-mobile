import { encode } from 'base-64';

import { getStore } from 'store';
import { selectSettings } from 'lib/settings';

function getConfig() {
  const state = getStore().getState();
  const {
    coreMode,
    embeddedUser,
    embeddedPassword,
    externalCoreIP,
    externalCoreAPIPort,
    externalCoreAPIUser,
    externalCoreAPIPassword,
  } = selectSettings(state);

  return coreMode === 'embedded'
    ? {
        ip: '127.0.0.1',
        port: '8080',
        user: embeddedUser,
        password:embeddedPassword,
      }
    : {
        ip: externalCoreIP,
        port: externalCoreAPIPort,
        user: externalCoreAPIUser,
        password: externalCoreAPIPassword,
      };
}

export async function sendAPI(endpoint, params) {
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
