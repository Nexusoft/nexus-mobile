import React from 'react';
import {
  View,
  Clipboard,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Button, FAB, Snackbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

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
import { navigate, navReadyRef, navContainerRef } from 'lib/navigation';
import { callAPI } from 'lib/api';
import { closeUnlockScreen, saveUsernameToUI, showError, showNotification } from 'lib/ui';
import { updateSettings } from 'lib/settings';
import { getStore } from 'store';
import CopyIcon from 'icons/copy.svg';
import UserIcon from 'icons/user.svg';
import UnlockIcon from 'icons/unlock.svg';
import UnauthenticatedBase from './UnauthenticatedBase';
import OverviewScreen from './OverviewScreen';

const styles = {
  container: ({ theme }) => ({
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
    marginBottom: 60,
  },
};

const doubleBackTime = 3000;
function BaseScreenContainer({ unStyled, children }) {
  const theme = useTheme();
  const [lastBackPressed, setLastBackPressed] = React.useState(null);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        const handler = () => {
          const now = Date.now();
          if (!lastBackPressed || now - lastBackPressed > doubleBackTime) {
            setLastBackPressed(now);
            setSnackbarVisible(true);
            return true;
          }
        };
        BackHandler.addEventListener('hardwareBackPress', handler);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handler);
        };
      }
    }, [lastBackPressed, snackbarVisible])
  );

  return (
    <View style={[!unStyled && styles.container({ theme }), { flex: 1 }]}>
      {children}
      <Snackbar
        visible={snackbarVisible}
        duration={doubleBackTime}
        onDismiss={() => {
          setSnackbarVisible(false);
        }}
      >
        Press back again to close the app
      </Snackbar>
    </View>
  );
}

function DisconnectedBase() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  return (
    <BaseScreenContainer>
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
    </BaseScreenContainer>
  );
}

function UnlockingBase() {
  const theme = useTheme();
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState('');
  const savedUsername = useSelector((state) => state.settings.savedUsername);

  const unlock = async () => {
    setLoading(true);
    try {
      await callAPI('sessions/load/local', {
        pin,
        username: savedUsername,
      });
      await refreshUserStatus();
      saveUsernameToUI(savedUsername);
      closeUnlockScreen();
    } catch (err) {
      setLoading(false);
      showError(err?.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BaseScreenContainer>
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
          onSubmitEditing={unlock}
          secure
          keyboardType={
            Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
          }
        />
        <FAB
          disabled={loading}
          onPress={unlock}
          loading={loading}
          color={theme.dark ? theme.onPrimary : theme.primary}
          style={[
            styles.submitBtn,
            theme.dark ? undefined : { backgroundColor: theme.onPrimary },
          ]}
          icon={(props) => <SvgIcon icon={UnlockIcon} {...props} />}
          label={loading ? 'Unlocking...' : 'Unlock wallet'}
        />
        <Button
          mode="text"
          color={theme.dark ? theme.foreground : theme.onPrimary}
          labelStyle={{ fontSize: 12 }}
          onPress={() => {
            updateSettings({ savedUsername: null });
            closeUnlockScreen();
          }}
        >
          Log in as another user
        </Button>
      </BaseScreenContainer>
    </TouchableWithoutFeedback>
  );
}

function UnconfirmedUserBase() {
  const { username } = useSelector((state) => state.user.status);
  const theme = useTheme();
  const txid = useSelector((state) => state.user.registrationTxids[username]);
  const color = theme.dark ? theme.foreground : theme.onPrimary;
  return (
    <BaseScreenContainer>
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
    </BaseScreenContainer>
  );
}

function SynchronizingBase() {
  const theme = useTheme();
  const percentage = useSelector((state) => state.core.info?.syncprogress);
  return (
    <BaseScreenContainer>
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
    </BaseScreenContainer>
  );
}

const selectDefaultScreenStates = (() => {
  let cache = null;
  return (state) => {
    const connected = selectConnected(state);
    const unlocking = state.ui.unlockingWallet;
    const syncing = state.core.info?.synchronizing;
    const loggedIn = selectLoggedIn(state);
    if (
      !cache ||
      connected !== cache.connected ||
      unlocking !== cache.unlocking ||
      syncing !== cache.syncing ||
      loggedIn !== cache.loggedIn
    ) {
      cache = {
        connected,
        unlocking,
        syncing,
        loggedIn,
      };
    }
    return cache;
  };
})();

// Fix default BottomTab screen being the first tab when login state changes
function useDefaultScreenFix() {
  React.useEffect(() => {
    const store = getStore();
    store.observe(
      selectDefaultScreenStates,
      ({ connected, unlocking, syncing, loggedIn }) => {
        if (
          navReadyRef.current &&
          navContainerRef.current?.getRootState() &&
          connected &&
          !syncing &&
          unlocking === false &&
          !loggedIn
        ) {
          navigate('Login');
        }
      }
    );
  }, []);
}

function useDynamicNavOptions({ loggedIn, route, navigation }) {
  const theme = useTheme();
  const txFilterOpen = useSelector((state) => state.ui.transactionsFilter.open);
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

  if (!loggedIn)
    return (
      <BaseScreenContainer unStyled>
        <UnauthenticatedBase />
      </BaseScreenContainer>
    );

  if (!confirmedUser) return <UnconfirmedUserBase />;

  return (
    <BaseScreenContainer unStyled>
      <OverviewScreen />
    </BaseScreenContainer>
  );
}

BaseScreen.nav = {
  name: 'Base',
};
