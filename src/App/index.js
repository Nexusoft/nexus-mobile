import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { AppState, Platform, UIManager, View, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  requestPermissionsAsync,
  setNotificationHandler,
  setNotificationChannelAsync,
  AndroidImportance,
} from 'expo-notifications';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from 'lib/theme';
import { getStore } from 'store';

import ThemeContainer from './ThemeContainer';
import StatusBar from './StatusBar';
import Notifications from './Notifications';
import Dialogs from './Dialogs';
import DrawerNavigator from './DrawerNavigator';
import SyncIndicator from './SyncIndicator';
import initStore from './initStore';

import BackgroundTimer from 'react-native-background-timer';

import {selectLoggedIn, refreshUserStatus} from 'lib/user';


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
      ...Ionicons.font,
      ...MaterialIcons.font,
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
  setNotificationChannelAsync('transaction-channel-id', {
    name: 'Transaction Channel',
    importance: AndroidImportance.HIGH,
    description:' Notification Channel for incoming Transactions'
  });
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
      <SyncIndicator />
    </View>
  );
}

// Possible issue in crossplatform solution, fallback to ios specific
var iosBGTimerInterval = null;

const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == "background") {
      // Consider rework? Had to fallback to platform specific, possible error in package
      if (Platform.OS === 'android') {
        BackgroundTimer.runBackgroundTimer(() => { 
          console.log("@@@@@@@  BACKGROUND @@@@@@@");
          if (selectLoggedIn)
            {
              refreshUserStatus();
            }
          },
          10000);
        
      }
      else //ios
      {
        BackgroundTimer.start();
        iosBGTimerInterval = setInterval(() => {
          console.log("@@@@@@@  BACKGROUND IOS @@@@@@@");
          refreshUserStatus();
        }, 10000);
      }
  }
  else
  {
    if (Platform.OS === 'android') {
      BackgroundTimer.stopBackgroundTimer(); 
    }
    else //ios
    {
      clearInterval(iosBGTimerInterval );
      BackgroundTimer.stop();
    }
  }
}


export default function Root() {
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
        setTimeout(() => {
          // Ugly
          Alert.alert(
            "Nexus Core Is Running",
            "Nexus Core will continue to sync with the network in the background unless app is closed.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }

          );
        }, 10000);
        setLoadingComplete(true);
        
      } finally {
        //suppressed warning, should probably be refactored
        SplashScreen.hideAsync();
        
       
      }
      
    })(() => AppState.removeEventListener("change", _handleAppStateChange))
  }, []);

  if (!loadingComplete) {
    return null;
  } else {
    AppState.addEventListener("change", _handleAppStateChange);
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
