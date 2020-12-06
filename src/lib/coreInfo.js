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

const regularWaitTime = 10000;
const quickWaitTime = 1000;
let waitTime = regularWaitTime;
let timerId = null;
export async function refreshCoreInfo() {
  try {
    clearTimeout(timerId);
    const coreInfo = await getInfo();
    if (coreInfo?.synchronizing && coreInfo?.clientmode) {
      // Refresh quicker so that sync percentage is updated more frequently
      waitTime = quickWaitTime;
    } else {
      waitTime = regularWaitTime;
    }
    return coreInfo;
  } catch (err) {
    waitTime = quickWaitTime;
    return null;
  } finally {
    timerId = setTimeout(refreshCoreInfo, waitTime);
  }
}
