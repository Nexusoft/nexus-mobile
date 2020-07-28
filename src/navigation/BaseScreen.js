import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import { selectConnected } from 'lib/coreInfo';
import { navigate, navReadyRef } from 'lib/navigation';
import { getStore } from 'store';
import UnauthenticatedBase from './UnauthenticatedBase';
import AuthenticatedBase from './AuthenticatedBase';

function DisconnectedBase() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: theme.dark ? theme.background : theme.primary,
      }}
    >
      <Text
        sub
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={18}
        style={{ textAlign: 'center' }}
      >
        Connecting to Nexus Core...
      </Text>
    </View>
  );
}

// Fix default BottomTab screen being the first tab when login state changes
function useDefaultScreenFix() {
  React.useEffect(() => {
    const store = getStore();
    store.observe(selectLoggedIn, (loggedIn) => {
      if (!navReadyRef.current) return;
      const store = getStore();
      const connected = selectConnected(store.getState());
      if (!connected) return;
      if (loggedIn) {
        navigate('Overview');
      } else {
        navigate('Login');
      }
    });
  }, []);
}

function useDynamicNavOptions({ loggedIn, route, navigation }) {
  const theme = useTheme();
  const txFilterOpen = useSelector((state) => state.ui.txFilterOpen);
  const contactSearch = useSelector((state) => state.ui.contactSearch);
  React.useLayoutEffect(() => {
    if (loggedIn) {
      const options = AuthenticatedBase.stackOptions({
        theme,
        navigation,
        txFilterOpen,
        contactSearch,
        route,
      });
      navigation.setOptions(options);
    } else {
      const options = UnauthenticatedBase.stackOptions({
        theme,
      });
      navigation.setOptions(options);
    }
  }, [route, navigation, theme, loggedIn, txFilterOpen, contactSearch]);
}

export default function BaseScreen({ route, navigation }) {
  const connected = useSelector(selectConnected);
  const loggedIn = useSelector(selectLoggedIn);
  useDefaultScreenFix();
  useDynamicNavOptions({ route, navigation, loggedIn });

  return connected ? (
    loggedIn ? (
      <AuthenticatedBase />
    ) : (
      <UnauthenticatedBase />
    )
  ) : (
    <DisconnectedBase />
  );
}

BaseScreen.nav = {
  name: 'Base',
};
