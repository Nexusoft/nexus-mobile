import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Button } from 'react-native-paper';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { selectLoggedIn } from 'lib/user';
import { selectConnected, refreshCoreInfo } from 'lib/coreInfo';
import { navigate, navReadyRef } from 'lib/navigation';
import { getStore } from 'store';
import UnauthenticatedBase from './UnauthenticatedBase';
import OverviewScreen from './OverviewScreen';

const styles = {
  container: ({ theme }) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
};

function DisconnectedBase() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  return (
    <View style={styles.container({ theme })}>
      <ActivityIndicator
        animating
        color={theme.dark ? theme.foreground : theme.onPrimary}
      />
      <Text
        sub
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={18}
        style={{ textAlign: 'center', marginTop: 20 }}
      >
        Connecting to Nexus Core...
      </Text>
      <Button
        mode="outlined"
        disabled={refreshing}
        onPress={async () => {
          setRefreshing(true);
          const coreInfo = await refreshCoreInfo();
          if (!coreInfo) setRefreshing(false);
        }}
        style={{
          marginTop: 50,
          borderColor: theme.dark ? undefined : theme.onPrimary,
        }}
        labelStyle={theme.dark ? undefined : { color: theme.onPrimary }}
      >
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
    </View>
  );
}

function SynchronizingBase() {
  const theme = useTheme();
  const percentage = useSelector((state) => state.core.info?.synccomplete);
  return (
    <View style={styles.container({ theme })}>
      <ActivityIndicator
        animating
        color={theme.dark ? theme.foreground : theme.onPrimary}
      />
      <Text
        sub
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={18}
        style={{ textAlign: 'center', marginTop: 20 }}
      >
        Synchronizing {percentage}%...
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
      if (!loggedIn) {
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
      const options = OverviewScreen.stackOptions({
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
        route,
      });
      navigation.setOptions(options);
    }
  }, [route, navigation, theme, loggedIn, txFilterOpen, contactSearch]);
}

export default function BaseScreen({ route, navigation }) {
  const connected = useSelector(selectConnected);
  const loggedIn = useSelector(selectLoggedIn);
  const syncing = useSelector((state) => state.core.info?.synchronizing);
  useDefaultScreenFix();
  useDynamicNavOptions({ route, navigation, loggedIn });

  if (!connected) return <DisconnectedBase />;

  if (syncing) return <SynchronizingBase />;

  if (!loggedIn) return <UnauthenticatedBase />;

  return <OverviewScreen />;
}

BaseScreen.nav = {
  name: 'Base',
};
