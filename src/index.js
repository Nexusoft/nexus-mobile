import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Platform, UIManager, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { useTheme } from 'lib/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getPaperTheme } from 'lib/theme';
import { setupUser } from 'lib/user';
import { refreshCoreInfo } from 'lib/coreInfo';
import { createStore, getStore } from 'store';
import loadInitialState from 'store/loadInitialState';

import Notifications from './Notifications';
import Dialogs from './Dialogs';
import DrawerNavigator from './navigation/DrawerNavigator';

// For using LayoutAnimation
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const styles = {
  container: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.background,
  }),
};

function PaperContainer({ children }) {
  const theme = useTheme();
  return <PaperProvider theme={getPaperTheme(theme)}>{children}</PaperProvider>;
}

async function loadResourcesAndData() {
  try {
    // Load fonts
    await Font.loadAsync({
      ...Ionicons.font,
      ...MaterialIcons.font,
      'noto-sans': require('./fonts/NotoSans-Regular.ttf'),
      'noto-sans-bold': require('./fonts/NotoSans-Bold.ttf'),
      robotomono: require('./fonts/RobotoMono-Regular.ttf'),
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
          <PaperContainer>
            <App />
          </PaperContainer>
        </SafeAreaProvider>
      </ReduxProvider>
    );
  }
}
