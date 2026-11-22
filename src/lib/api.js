import { encode } from 'base-64';

import { getStore } from 'store';
import { selectSetting } from 'lib/settings';
import { loadEmbeddedCredentials } from 'lib/embeddedCore';

const requestTimeoutMs = 60000;

function getConfig() {
  const state = getStore().getState();
  const coreMode = selectSetting('coreMode')(state);
  if (coreMode === 'embedded') {
    const embeddedUser = selectSetting('embeddedUser')(state);
    const embeddedPassword = selectSetting('embeddedPassword')(state);
    return {
      embedded: true,
      protocol: 'https',
      ip: 'localhost',
      port: '7080',
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
    const externalCoreSSL = selectSetting('externalCoreSSL')(state);
    return {
      embedded: false,
      protocol: externalCoreSSL ? 'https' : 'http',
      ip: externalCoreIP,
      port: externalCoreAPIPort,
      user: externalCoreAPIUser,
      password: externalCoreAPIPassword,
    };
  }
}

async function sendRequest(config, endpoint, params) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    return await fetch(
      `${config.protocol}://${config.ip}:${config.port}/${endpoint}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + encode(`${config.user}:${config.password}`),
        },
        body: params && JSON.stringify(params),
        signal: controller.signal,
      }
    );
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Nexus Core did not answer in time' };
    }
    throw {
      code: 'NETWORK',
      message: 'Cannot reach Nexus Core' + (err?.message ? ': ' + err.message : ''),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function callAPI(endpoint, params) {
  let config = getConfig();
  let response = await sendRequest(config, endpoint, params);
  if (response.status === 401 && config.embedded) {
    if (await loadEmbeddedCredentials()) {
      config = getConfig();
      response = await sendRequest(config, endpoint, params);
    }
  }
  if (response.status === 401) {
    throw {
      code: 401,
      message: config.embedded
        ? 'Nexus Core refused the API login, restart the app'
        : 'Nexus Core refused the API username or password',
    };
  }
  let content = null;
  try {
    content = await response.json();
  } catch (err) {
    throw {
      code: response.status,
      message: `Unexpected answer from Nexus Core (HTTP ${response.status})`,
    };
  }
  if (response.ok) {
    return content?.result;
  } else {
    throw content?.error || { code: response.status, message: 'API error' };
  }
}
