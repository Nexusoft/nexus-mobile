import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

//the PIN lives only in the phone's secure storage (Android Keystore / iOS
//Keychain) and is read after a fingerprint or face check, to unlock a saved session
const pinKey = (username) =>
  'unlockPin_' + String(username).replace(/[^A-Za-z0-9._-]/g, '_');

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

export async function hasBiometricUnlock(username) {
  if (!username) return false;
  try {
    return !!(await SecureStore.getItemAsync(pinKey(username)));
  } catch (err) {
    return false;
  }
}

export async function enableBiometricUnlock(username, pin) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirm to turn on fingerprint / face unlock',
  });
  if (!result.success) return false;
  await SecureStore.setItemAsync(pinKey(username), pin);
  return true;
}

export async function disableBiometricUnlock(username) {
  if (!username) return;
  try {
    await SecureStore.deleteItemAsync(pinKey(username));
  } catch (err) {}
}

export async function readPinWithBiometric(username) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Nexus Wallet',
    fallbackLabel: 'Use PIN',
  });
  if (!result.success) return null;
  return await SecureStore.getItemAsync(pinKey(username));
}
