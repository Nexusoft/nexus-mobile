import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { AppState, Platform, UIManager, View } from 'react-native';
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

const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == "background") {


      BackgroundTimer.runBackgroundTimer(() => { 
        console.log("@@@@@@@  BACKGROUND @@@@@@@");
        if (selectLoggedIn)
          {
            refreshUserStatus();
          }
        },
        10000);
  }
  else
  {
    BackgroundTimer.stopBackgroundTimer(); 
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
