import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { t } from 'lib/i18n';

//the PIN lives only in the phone's secure storage (Android Keystore / iOS
//Keychain) and is read after a fingerprint or face check: 'unlock' opens a
//saved session, 'send' confirms sends
const pinKey = (username, purpose = 'unlock') =>
  purpose + 'Pin_' + String(username).replace(/[^A-Za-z0-9._-]/g, '_');

export async function biometricAvailable() {
  try {
    return (
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync())
    );
  } catch (err) {
    return false;
  }
}

//fingerprint / face check alone, no stored secret (app lock)
export async function checkBiometric(promptMessage) {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: t('Use PIN'),
    });
    return !!result.success;
  } catch (err) {
    return false;
  }
}

export async function hasBiometricPin(username, purpose) {
  if (!username) return false;
  try {
    return !!(await SecureStore.getItemAsync(pinKey(username, purpose)));
  } catch (err) {
    return false;
  }
}

export async function enableBiometricPin(username, pin, purpose) {
  const ok = await checkBiometric(
    purpose === 'send'
      ? t('Confirm to send with fingerprint / face')
      : t('Confirm to turn on fingerprint / face unlock')
  );
  if (!ok) return false;
  await SecureStore.setItemAsync(pinKey(username, purpose), pin);
  return true;
}

export async function disableBiometricPin(username, purpose) {
  if (!username) return;
  try {
    await SecureStore.deleteItemAsync(pinKey(username, purpose));
  } catch (err) {}
}

export async function readPinWithBiometric(username, purpose, promptMessage) {
  const ok = await checkBiometric(promptMessage || t('Unlock Nexus Wallet'));
  if (!ok) return null;
  return await SecureStore.getItemAsync(pinKey(username, purpose));
}

//saved session unlock
export const hasBiometricUnlock = (username) => hasBiometricPin(username);
export const enableBiometricUnlock = (username, pin) =>
  enableBiometricPin(username, pin);
export async function disableBiometricUnlock(username) {
  await disableBiometricPin(username);
}

//on logout every stored PIN of the user goes
export async function forgetBiometricPins(username) {
  await disableBiometricPin(username, 'unlock');
  await disableBiometricPin(username, 'send');
}
