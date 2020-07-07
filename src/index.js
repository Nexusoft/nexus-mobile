import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { Platform, UIManager, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useTheme } from 'emotion-theming';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { darkTheme, lightTheme, getPaperTheme } from 'lib/theme';
import { getStore } from 'store';
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

const Container = styled(View)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

function PaperContainer({ children }) {
  const theme = useTheme();
  return <PaperProvider theme={getPaperTheme(theme)}>{children}</PaperProvider>;
}

function ThemeController(props) {
  const darkMode = useSelector((state) => state.settings.darkMode);
  return <ThemeProvider theme={darkMode ? darkTheme : lightTheme} {...props} />;
}

async function loadResourcesAndDataAsync() {
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

async function initializeStore(setStore) {
  const initialState = await loadInitialState();
  const store = getStore(initialState);
  return store;
}

export default function Root(props) {
  const [store, setStore] = React.useState(null);
  const [loadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    (async () => {
      try {
        SplashScreen.preventAutoHide();
        const [_, store] = await Promise.all([
          loadResourcesAndDataAsync(),
          initializeStore(),
        ]);
        setStore(store);
        setLoadingComplete(true);
      } finally {
        SplashScreen.hide();
      }
    })();
  }, []);

  if ((!loadingComplete && !props.skipLoadingScreen) || !store) {
    return null;
  } else {
    return (
      <ReduxProvider store={store}>
        <ThemeController>
          <Container>
            <SafeAreaProvider>
              <PaperContainer>
                <DrawerNavigator />
                <Dialogs />
                <Notifications />
              </PaperContainer>
            </SafeAreaProvider>
          </Container>
        </ThemeController>
      </ReduxProvider>
    );
  }
}
