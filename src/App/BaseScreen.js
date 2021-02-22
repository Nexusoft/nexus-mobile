import React from 'react';
import { View, Clipboard, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Button, FAB } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import InfoField from 'components/InfoField';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import {
  selectLoggedIn,
  selectUserIsConfirmed,
  refreshUserStatus,
} from 'lib/user';
import { selectConnected, refreshCoreInfo } from 'lib/coreInfo';
import { navigate, navReadyRef } from 'lib/navigation';
import { callAPI } from 'lib/api';
import { closeUnlockScreen } from 'lib/ui';
import { getStore } from 'store';
import CopyIcon from 'icons/copy.svg';
import UserIcon from 'icons/user.svg';
import UnauthenticatedBase from './UnauthenticatedBase';
import OverviewScreen from './OverviewScreen';

const styles = {
  container: ({ theme }) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.dark ? theme.background : theme.primary,
    paddingHorizontal: 30,
  }),
  creating: {
    marginTop: 50,
    verticalAlign: 'center',
  },
  creatingText: {
    marginTop: 40,
    textAlign: 'center',
  },
  username: { marginTop: 10, marginBottom: 30, textAlign: 'center' },
  pinInput: {
    // fontSize: 18,
    marginBottom: 30,
    width: '100%',
    maxWidth: 250,
  },
  submitBtn: {
    width: '100%',
    maxWidth: 250,
  },
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

function UnlockingBase() {
  const theme = useTheme();
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState('');
  const savedUsername = useSelector((state) => state.settings.savedUsername);
  return (
    <View style={styles.container({ theme })}>
      <SvgIcon
        icon={UserIcon}
        size={66}
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
      />
      <Text
        style={styles.username}
        size={26}
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
      >
        {savedUsername}
      </Text>
      <TextBox
        mode="flat"
        style={styles.pinInput}
        background={theme.dark ? 'background' : 'primary'}
        label="Enter your PIN"
        value={pin}
        onChangeText={setPin}
        secure
        keyboardType={
          Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
        }
      />
      <FAB
        disabled={loading}
        onPress={async () => {
          setLoading(true);
          try {
            await callAPI('users/load/session', {
              pin,
              username: savedUsername,
            });
            await refreshUserStatus();
            closeUnlockScreen();
          } catch (err) {
            setLoading(false);
            console.error(err);
          }
        }}
        loading={loading}
        color={theme.dark ? theme.onPrimary : theme.primary}
        style={[
          styles.submitBtn,
          theme.dark ? undefined : { backgroundColor: theme.onPrimary },
        ]}
        label={loading ? 'Unlocking...' : 'Unlock wallet'}
      />
    </View>
  );
}

function UnconfirmedUserBase() {
  const { username } = useSelector((state) => state.user.status);
  const theme = useTheme();
  const txid = useSelector((state) => state.user.registrationTxids[username]);
  const color = theme.dark ? theme.foreground : theme.onPrimary;
  return (
    <View style={styles.container({ theme })}>
      <ActivityIndicator animating color={color} />
      <Text style={styles.creatingText} sub color={color} size={18}>
        User registration for{' '}
        <Text bold color={color}>
          {username}
        </Text>{' '}
        is waiting to be confirmed on Nexus blockchain...
      </Text>
      <InfoField
        label="Transaction ID"
        color={color}
        control={
          <Button
            color={color}
            mode="text"
            icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
            labelStyle={{ fontSize: 12 }}
            onPress={() => {
              Clipboard.setString(txid);
              showNotification('Copied to clipboard');
            }}
          >
            Copy
          </Button>
        }
        value={
          <Text mono size={13} color={color}>
            {txid}
          </Text>
        }
        mono
        bordered
      />
    </View>
  );
}

function SynchronizingBase() {
  const theme = useTheme();
  const percentage = useSelector((state) => state.core.info?.syncprogress);
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
  const unlocking = useSelector((state) => state.ui.unlockingWallet);
  const syncing = useSelector((state) => state.core.info?.synchronizing);
  const loggedIn = useSelector(selectLoggedIn);
  const confirmedUser = useSelector(selectUserIsConfirmed);

  useDefaultScreenFix();
  useDynamicNavOptions({
    route,
    navigation,
    loggedIn: loggedIn && confirmedUser,
  });

  if (!connected) return <DisconnectedBase />;

  if (syncing) return <SynchronizingBase />;

  if (unlocking) return <UnlockingBase />;

  if (!loggedIn) return <UnauthenticatedBase />;

  if (!confirmedUser) return <UnconfirmedUserBase />;

  return <OverviewScreen />;
}

BaseScreen.nav = {
  name: 'Base',
};
