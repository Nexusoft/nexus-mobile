import * as TYPE from 'consts/actionTypes';
import { sendAPI } from 'lib/api';
import { getStore } from 'store';

export const selectConnected = (state) => !!state.core.info;

async function getInfo() {
  const store = getStore();
  try {
    const coreInfo = await sendAPI('system/get/info');
    console.log(coreInfo);
    store.dispatch({ type: TYPE.SET_CORE_INFO, payload: coreInfo });
    return coreInfo;
  } catch (err) {
    store.dispatch({ type: TYPE.DISCONNECT_CORE });
    throw err;
  }
}

const maxTime = 10000;
const quickWaitTime = 1000;
const incStep = 1000;
let waitTime = 0;
let timerId = null;
export async function refreshCoreInfo() {
  const connected = selectConnected(getStore().getState());
  try {
    clearTimeout(timerId);
    const coreInfo = await getInfo();
    if (coreInfo?.synchronizing && coreInfo?.clientmode) {
      // Refresh core info quicker so that sync % displayed is more updated
      waitTime = quickWaitTime;
    } else {
      waitTime = maxTime;
    }
    return coreInfo;
  } catch (err) {
    if (connected) waitTime = incStep;
    else if (waitTime < maxTime) waitTime += incStep;
    else waitTime = maxTime;
    return null;
  } finally {
    timerId = setTimeout(refreshCoreInfo, waitTime);
  }
}
