import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { AppState, Platform, UIManager, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { getStore } from 'store';

import ThemeContainer from './ThemeContainer';
import StatusBar from './StatusBar';
import Notifications from './Notifications';
import Dialogs from './Dialogs';
import DrawerNavigator from './DrawerNavigator';
import SyncIndicator from './SyncIndicator';
import initStore from './initStore';

import { sendAPI } from 'lib/api';
import { encode } from 'base-64';

import BackgroundTimer from 'react-native-background-timer';

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
        sendAPI("system/get/info").then(res => console.log(res));
        },
        3000);
  }
  else
  {
    BackgroundTimer.stopBackgroundTimer(); 
  }
}


export default function Root(props) {
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app
  
  React.useEffect(() => {
    (async () => {
      try {

        AppState.addEventListener("change", _handleAppStateChange);

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

  if (!loadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
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
