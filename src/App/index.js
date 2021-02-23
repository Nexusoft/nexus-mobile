import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { AppState, Platform, UIManager, View, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  requestPermissionsAsync,
  setNotificationHandler,
  setNotificationChannelAsync,
  AndroidImportance,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from 'lib/theme';
import { getStore } from 'store';

import ThemeContainer from './ThemeContainer';
import StatusBar from './StatusBar';
import Notifications from './Notifications';
import Dialogs from './Dialogs';
import DrawerNavigator from './DrawerNavigator';
import initStore from './initStore';

import BackgroundTimer from 'react-native-background-timer';

import { selectLoggedIn, refreshUserSync, refreshHeaders } from 'lib/user';
import { loadSettings, selectSetting, updateSettings } from 'lib/settings';

import RNFS from 'react-native-fs';
import { refreshCoreInfo } from 'lib/coreInfo';

// For using LayoutAnimation
if (Platform.OS === 'android') {
  UIManager?.setLayoutAnimationEnabledExperimental(true);
}

const styles = {
  container: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.background,
  }),
};

async function loadResources() {
  try {
    // Load fonts
    await Font.loadAsync({
      'noto-sans': require('fonts/NotoSans-Regular.ttf'),
      'noto-sans-bold': require('fonts/NotoSans-Bold.ttf'),
      robotomono: require('fonts/RobotoMono-Regular.ttf'),
    });
  } catch (e) {
    // We might want to provide this error information to an error reporting service
    console.warn(e);
  }
}
async function checkPermissions() {
  await requestPermissionsAsync({
    android: {},
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowCriticalAlerts: true,
    },
  });
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  if (Platform.OS === 'android') {
    //Only used for Android
    setNotificationChannelAsync('transaction-channel-id', {
      name: 'Transaction Channel',
      importance: AndroidImportance.HIGH,
      description: ' Notification Channel for incoming Transactions',
    });
  }
}

function App() {
  const theme = useTheme();
  return (
    <View style={styles.container({ theme })}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          Platform.OS === 'ios'
            ? theme.dark
              ? theme.background
              : theme.primary
            : theme.dark
            ? '#000'
            : theme.primaryVariant
        }
      />
      <DrawerNavigator />
      <Dialogs />
      <Notifications />
    </View>
  );
}

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import sleep from 'utils/sleep';
import { confirmPin, showOnboarding } from 'lib/ui';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );
  await sleep(25000);
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  registerIOSBackgroundTask();
  return BackgroundFetch.Result.NewData;
});

const _handleAppStateChange = (nextAppState) => {
  if (nextAppState == 'background') {
    if (Platform.OS === 'android') {
      BackgroundTimer.runBackgroundTimer(() => {
        if (selectLoggedIn(getStore().getState())) {
          refreshCoreInfo();
        }
      }, 25000);
    } //ios
    else {
      if (!isInBG) {
        isInBG = true;
        registerIOSBackgroundTask();
      }
    }
  } else {
    if (nextAppState == 'active') {
      if (Platform.OS === 'android') {
        BackgroundTimer.stopBackgroundTimer();
      } //ios
      else {
        if (isInBG) {
          TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK).then(
            async (isRegistered) => {
              if (isRegistered) {
                BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
                await refreshCoreInfo();
                await refreshHeaders();
                await refreshUserSync();
              }
            }
          );
        }

        isInBG = false;
      }
    }
  }
};

var isInBG = false;

const registerIOSBackgroundTask = async () => {
  console.log('Reg Task');
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // 1 minute
    stopOnTerminate: false,
    startOnBoot: true,
  });
  console.log('Finished Reg');
  await BackgroundFetch.setMinimumIntervalAsync(60);
};

export default function Root(props) {
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app

  React.useEffect(() => {
    checkPermissions();
    (async () => {
      try {
        //suppressed warning, should probably be refactored
        SplashScreen.preventAutoHideAsync()
          .then((result) => {
            return;
          })
          .catch((error) => {
            return;
          });

        await Promise.all([initStore(), loadResources()]);
        //Reading Nexus.conf
        const result = await RNFS.readFile(
          (Platform.OS === 'android'
            ? RNFS.ExternalDirectoryPath
            : RNFS.DocumentDirectoryPath) + '/Nexus/nexus.conf',
          'ascii'
        );
        updateSettings({
          embeddedUser: result.split('\n')[0].replace('apiuser=', ''),
          embeddedPassword: result.split('\n')[1].replace('apipassword=', ''),
        });

        const showOnboard = selectSetting('showOnboarding')(
          getStore().getState()
        );
        if (showOnboard) {
          showOnboarding();
        }
        setLoadingComplete(true);
      } finally {
        //suppressed warning, should probably be refactored
        SplashScreen.hideAsync();
      }
    })(() => AppState.removeEventListener('change', _handleAppStateChange));
  }, []);

  if (!loadingComplete) {
    return null;
  } else {
    AppState.addEventListener('change', _handleAppStateChange);
    return (
      <ReduxProvider store={getStore()}>
        <SafeAreaProvider>
          <ThemeContainer>
            <App />
          </ThemeContainer>
        </SafeAreaProvider>
      </ReduxProvider>
    );
  }
}
