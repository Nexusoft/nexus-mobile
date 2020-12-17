import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { AppState, Platform, UIManager, View, Alert, AppRegistry } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  requestPermissionsAsync,
  setNotificationHandler,
  setNotificationChannelAsync,
  AndroidImportance,
  scheduleNotificationAsync,
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
import initStore from './initStore';

import BackgroundTimer from 'react-native-background-timer';

import {selectLoggedIn, refreshUserStatus} from 'lib/user';
import { updateSettings } from 'lib/settings';

import RNFS from 'react-native-fs'
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
  if (Platform.OS === 'android'){
    //Only used for Android
    setNotificationChannelAsync('transaction-channel-id', {
      name: 'Transaction Channel',
      importance: AndroidImportance.HIGH,
      description:' Notification Channel for incoming Transactions'
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

// Possible issue in crossplatform solution, fallback to ios specific
var iosBGTimerInterval = null;

import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import sleep from 'utils/sleep';
import { set } from 'react-native-reanimated';



const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );
  
  await sleep(15000);
  scheduleNotificationAsync({
    content: {
      title: 'Updated',
      body: `The core was updated at ${new Date(now).toISOString()}`,
    },
    trigger: null,
  });
  
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  registerIOSBackgroundTask();
  return BackgroundFetch.Result.NewData;
});

const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == "background") {
      if (Platform.OS === 'android') {
        BackgroundTimer.runBackgroundTimer(() => { 
          console.log("@@@@@@@  BACKGROUND @@@@@@@");
          if (selectLoggedIn)
            {
              refreshUserStatus();
              refreshCoreInfo();
            }
          },
          25000);
        
      }
      else //ios
      {
        if (!isInBG)
        {
          isInBG = true;
          registerIOSBackgroundTask();
        } 
      }
      
  }
  else
  {
    if (nextAppState == 'active')
    {
      if (Platform.OS === 'android') {
        BackgroundTimer.stopBackgroundTimer(); 
      }
      else //ios
      {
        if (isInBG)
        {
          TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK).then
        (
          (isRegistered) => 
          {
            if (isRegistered)
            {
              console.log("Remove Task");
              BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
              refreshCoreInfo();
            }
          }
        );
        }
        
        isInBG = false;
      }
      
    }
   
  }
}

var isInBG = false;

const registerIOSBackgroundTask = async() => {
  console.log("Reg Task");
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // 1 minute
    stopOnTerminate: false,
    startOnBoot: true,
  });
  console.log("Finished Reg");
  await BackgroundFetch.setMinimumIntervalAsync(60)

}


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
        console.log("no Store so getting settings");
        const result = await RNFS.readFile((Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath) + "/Nexus/nexus.conf",'ascii');
        console.log(result);
    
          updateSettings({
            embeddedUser: result.split('\n')[0].replace('apiuser=',''),
            embeddedPassword: result.split('\n')[1].replace('apipassword=',''),
          });

        setTimeout(() => {
          // Ugly
          (Platform.OS === 'android' ?
          Alert.alert(
            "Nexus Core Is Running",
            "Nexus Core will continue to sync with the network in the background unless app is closed.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }

          ) : Alert.alert(
            "Nexus Core may lose sync",
            "Currently IOS limits background activity, Nexus will attempt to resync in the background but it is not guaranteed.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }

          )
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
