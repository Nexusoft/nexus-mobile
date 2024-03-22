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
  selectUsername,
} from 'lib/user';
import { selectConnected, refreshCoreInfo } from 'lib/coreInfo';
import { callAPI } from 'lib/api';
import { showError, showNotification, confirm } from 'lib/ui';
import { updateSettings } from 'lib/settings';
import * as TYPE from 'consts/actionTypes';
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
      let finishedIndexing = false;
      while (!finishedIndexing) {
        // This checks if the account has finished indexing after downloading the sigchain, consider revising this.
        let status = await callAPI('sessions/status/local');
        finishedIndexing = !status?.indexing;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      await callAPI('sessions/save/local', { pin });
      await callAPI('sessions/unlock/local', { pin, notifications: true });
      await refreshUserStatus();
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
            getStore().dispatch({
              type: TYPE.SET_IGNORE_SAVED_SESSION,
              payload: true,
            });
          }}
        >
          Log in as another user
        </Button>
      </BaseScreenContainer>
    </TouchableWithoutFeedback>
  );
}

function UnconfirmedUserBase() {
  const username = useSelector(selectUsername);
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
  const syncInfo = useSelector((state) => state.core.info?.syncing);
  return (
    <BaseScreenContainer>
      <ActivityIndicator
        animating
        color={theme.dark ? theme.foreground : theme.onPrimary}
      />
      <Text
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={24}
        style={{ textAlign: 'center', marginTop: 15 }}
      >
        Initializing database...
      </Text>
      <Text
        sub
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={18}
        style={{ textAlign: 'center', marginTop: 20 }}
      >
        Completed {syncInfo.completed}%
      </Text>
      <Text
        sub
        colorName={theme.dark ? 'foreground' : 'onPrimary'}
        size={18}
        style={{ textAlign: 'center' }}
      >
        Est. time remaining: {syncInfo.timeRemaining}
      </Text>

      <Button
        mode="outlined"
        color={theme.dark ? theme.foreground : theme.onPrimary}
        labelStyle={{ fontSize: 12 }}
        style={{
          marginTop: 80,
          borderColor: theme.dark ? theme.foreground : theme.onPrimary,
        }}
        onPress={async () => {
          const confirmed = await confirm({
            title: 'Ignore this screen?',
            message:
              'When the app is initializing the blockchain database, login might not work as intended and incorrect balances might be shown.\nAre you sure you want to ignore this screen and proceed to use the app anyway?',
            cancelLabel: 'Stay and wait',
            confirmLabel: 'Ignore',
            danger: true,
          });
          if (confirmed) {
            updateSettings({ ignoreSyncScreen: true });
          }
        }}
      >
        Ignore
      </Button>
    </BaseScreenContainer>
  );
}

function IndexingBase() {
  const theme = useTheme();
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
        Downloading and Indexing Sigchain...
      </Text>
    </BaseScreenContainer>
  );
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
  const hasSavedSession = useSelector((state) => state.user.hasSavedSession);
  const syncingFromScratch = useSelector(
    (state) => state.core.syncingFromScratch
  );
  const indexing = useSelector((state) => state.user.status?.indexing);
  const loggedIn = useSelector(selectLoggedIn);
  const confirmedUser = useSelector(selectUserIsConfirmed);
  const ignoreSavedSession = useSelector(
    (state) => state.ui.ignoreSavedSession
  );
  const ignoreSyncScreen = useSelector(
    (state) => state.settings.ignoreSyncScreen
  );

  useDynamicNavOptions({
    route,
    navigation,
    loggedIn: loggedIn && confirmedUser,
  });

  if (!connected) return <DisconnectedBase />;

  if (syncingFromScratch && !ignoreSyncScreen) return <SynchronizingBase />;

  if (indexing) return <IndexingBase />;

  if (loggedIn)
    return (
      <BaseScreenContainer unStyled>
        <OverviewScreen />
      </BaseScreenContainer>
    );

  if (hasSavedSession && !ignoreSavedSession) return <UnlockingBase />;

  if (!confirmedUser) return <UnconfirmedUserBase />;

  return (
    <BaseScreenContainer unStyled>
      <UnauthenticatedBase />
    </BaseScreenContainer>
  );
}

BaseScreen.nav = {
  name: 'Base',
};
