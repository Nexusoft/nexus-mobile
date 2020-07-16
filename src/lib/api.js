import { encode } from 'base-64';

import { getStore } from 'store';
import { selectSettings } from 'lib/settings';

export async function sendAPI(endpoint, params) {
  const state = getStore().getState();
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
  if (response.ok) {
    return response.json();
  } else {
    throw response.json()?.error;
  }
}
