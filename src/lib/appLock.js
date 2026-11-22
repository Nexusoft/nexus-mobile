import { AppState, Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

import * as TYPE from 'consts/actionTypes';
import { callAPI } from 'lib/api';
import { selectSetting } from 'lib/settings';
import { selectLoggedIn } from 'lib/user';
import { getStore } from 'store';

const screenCaptureKey = 'hidePreview';

export const selectAppLocked = (state) =>
  !!state.ui.appLocked && selectLoggedIn(state);

export function lockApp() {
  const store = getStore();
  if (!selectLoggedIn(store.getState())) return;
  store.dispatch({ type: TYPE.SET_APP_LOCKED, payload: true });
}

export function unlockApp() {
  getStore().dispatch({ type: TYPE.SET_APP_LOCKED, payload: false });
}

//true / false from the core, null when the core cannot check it (older than 5.1.5)
export async function checkPin(pin) {
  try {
    return (await callAPI('sessions/validate/pin', { pin })) === true;
  } catch (err) {
    if (err?.code === -2) return null;
    throw err;
  }
}

//Android: FLAG_SECURE keeps balances out of the recent apps list (and blocks screenshots)
async function applyHidePreview(on) {
  if (Platform.OS !== 'android') return;
  try {
    if (on) await ScreenCapture.preventScreenCaptureAsync(screenCaptureKey);
    else await ScreenCapture.allowScreenCaptureAsync(screenCaptureKey);
  } catch (err) {}
}

let leftAt = null;

export function watchAppLock() {
  const store = getStore();
  const setting = (key) => selectSetting(key)(store.getState());

  store.observe(selectSetting('hidePreview'), (on) => applyHidePreview(!!on));

  AppState.addEventListener('change', (next) => {
    if (next === 'background') {
      if (leftAt === null) leftAt = Date.now();
      //iOS takes the app switcher picture right away, so lock first when it is set to 0
      if (setting('appLock') && !setting('appLockAfter')) lockApp();
    } else if (next === 'active') {
      const away = leftAt === null ? 0 : Date.now() - leftAt;
      leftAt = null;
      if (setting('appLock') && away >= setting('appLockAfter') * 1000) {
        lockApp();
      }
    }
  });
}

//a session that was already open when the app started
export function lockOnStart() {
  const state = getStore().getState();
  if (selectSetting('appLock')(state) && selectLoggedIn(state)) lockApp();
}
