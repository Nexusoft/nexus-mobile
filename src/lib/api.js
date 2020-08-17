import { encode } from 'base-64';

import { getStore } from 'store';
import { selectSettings } from 'lib/settings';

export async function sendAPI(endpoint, params) {
  const state = getStore().getState();
  // TODO: handle embedded core mode
  const {
    externalCoreIP,
    externalCoreAPIPort,
    externalCoreAPIUser,
    externalCoreAPIPassword,
  } = selectSettings(state);
  const baseUrl = `http://${externalCoreIP}:${externalCoreAPIPort}`;
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + encode(`${externalCoreAPIUser}:${externalCoreAPIPassword}`),
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
