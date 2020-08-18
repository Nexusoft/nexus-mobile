import 'intl';
import 'intl/locale-data/jsonp/en';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Platform, UIManager, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  ThemeProvider,
  useDerivedTheme,
  useTheme,
  getPaperTheme,
} from 'lib/theme';
import { setupUser } from 'lib/user';
import { refreshCoreInfo } from 'lib/coreInfo';
import { createStore, getStore } from 'store';
import loadInitialState from 'store/loadInitialState';

import StatusBar from './StatusBar';
import Notifications from './Notifications';
import Dialogs from './Dialogs';
import DrawerNavigator from './DrawerNavigator';

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

function ThemeContainer({ children }) {
  const theme = useDerivedTheme();
  return (
    <ThemeProvider value={theme}>
      <PaperProvider theme={getPaperTheme(theme)}>{children}</PaperProvider>
    </ThemeProvider>
  );
}

async function loadResourcesAndData() {
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

function setupSubscribers(store) {
  setupUser(store);
}

async function initializeStore() {
  // Load initialState here to avoid circular dependencies
  const initialState = await loadInitialState();
  const store = await createStore(initialState);
  setupSubscribers(store);
  refreshCoreInfo();
  return store;
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

export default function Root(props) {
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    (async () => {
      try {
        SplashScreen.preventAutoHide();
        await Promise.all([initializeStore(), loadResourcesAndData()]);
        setLoadingComplete(true);
      } finally {
        SplashScreen.hide();
      }
    })();
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
