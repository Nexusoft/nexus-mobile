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
  selectUsername,
} from 'lib/user';
import {
  refreshUserStatus,
  waitForIndexing,
  friendlyLoginError,
  isWrongPinError,
} from 'lib/session';
import {
  biometricAvailable,
  hasBiometricUnlock,
  readPinWithBiometric,
  disableBiometricUnlock,
} from 'lib/biometric';
import PinPad from 'components/PinPad';
import { selectConnected, refreshCoreInfo } from 'lib/coreInfo';
import { callAPI } from 'lib/api';
import { showError, showNotification } from 'lib/ui';
import { t } from 'lib/i18n';
import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';
import CopyIcon from 'icons/copy.svg';
import UserIcon from 'icons/user.svg';
import UnlockIcon from 'icons/unlock.svg';
import UnauthenticatedBase from './UnauthenticatedBase';
import OverviewScreen from './OverviewScreen';
import SyncScreen from './SyncScreen';

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
  username: { marginTop: 10, marginBottom: 4, textAlign: 'center' },
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

//stack options set here skip the navigator, so the title is translated here
const translateTitle = (options) =>
  typeof options.title === 'string'
    ? { ...options, title: t(options.title) }
    : options;

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
        {t('Press back again to close the app')}
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
        {t('Connecting to Nexus Core...')}
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
        {refreshing ? t('Refreshing...') : t('Refresh')}
      </Button>
    </BaseScreenContainer>
  );
}

function UnlockingBase() {
  const theme = useTheme();
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [useKeyboard, setUseKeyboard] = React.useState(false);
  const [canBiometric, setCanBiometric] = React.useState(false);
  const savedUsername = useSelector((state) => state.settings.savedUsername);
  const color = theme.dark ? theme.foreground : theme.onPrimary;

  const unlock = async (pinValue = pin, { fromBiometric } = {}) => {
    if (loading || !pinValue) return;
    setLoading(true);
    try {
      await callAPI('sessions/load/local', {
        pin: pinValue,
        username: savedUsername,
      });
      await waitForIndexing();
      await callAPI('sessions/save/local', { pin: pinValue });
      try {
        await callAPI('sessions/unlock/local', {
          pin: pinValue,
          notifications: true,
        });
      } catch (err) {
        //-208 = already unlocked
        if (err?.code !== -208) throw err;
      }
      await refreshUserStatus();
    } catch (err) {
      setLoading(false);
      setPin('');
      if (fromBiometric && isWrongPinError(err)) {
        //stored PIN no longer works (changed elsewhere), forget it
        await disableBiometricUnlock(savedUsername);
        setCanBiometric(false);
        showError(
          t(
            'Fingerprint / face unlock was turned off because the saved PIN no longer works. Enter your PIN.'
          )
        );
      } else {
        showError(friendlyLoginError(err));
      }
    }
  };

  const unlockWithBiometric = async () => {
    try {
      const storedPin = await readPinWithBiometric(savedUsername);
      if (storedPin) await unlock(storedPin, { fromBiometric: true });
    } catch (err) {
      showError(err?.message);
    }
  };

  React.useEffect(() => {
    (async () => {
      const available =
        (await biometricAvailable()) &&
        (await hasBiometricUnlock(savedUsername));
      setCanBiometric(available);
      if (available) unlockWithBiometric();
    })();
  }, [savedUsername]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BaseScreenContainer>
        <SvgIcon icon={UserIcon} size={56} color={color} />
        <Text style={styles.username} size={24} color={color}>
          {t('Welcome back, {username}', { username: savedUsername })}
        </Text>
        {useKeyboard ? (
          <TextBox
            mode="flat"
            style={styles.pinInput}
            background={theme.dark ? 'background' : 'primary'}
            label={t('Enter your PIN')}
            value={pin}
            onChangeText={setPin}
            onSubmitEditing={() => unlock()}
            secure
            autoFocus
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
            }
          />
        ) : (
          <PinPad
            value={pin}
            onChange={setPin}
            color={color}
            disabled={loading}
            onKeyboard={() => setUseKeyboard(true)}
          />
        )}
        <FAB
          disabled={loading || !pin}
          onPress={() => unlock()}
          loading={loading}
          color={theme.dark ? theme.onPrimary : theme.primary}
          style={[
            styles.submitBtn,
            theme.dark ? undefined : { backgroundColor: theme.onPrimary },
          ]}
          icon={(props) => <SvgIcon icon={UnlockIcon} {...props} />}
          label={loading ? t('Unlocking...') : t('Unlock wallet')}
        />
        {canBiometric && !loading && (
          <Button
            mode="text"
            color={color}
            labelStyle={{ fontSize: 12 }}
            onPress={unlockWithBiometric}
          >
            {t('Use fingerprint / face')}
          </Button>
        )}
        <Button
          mode="text"
          color={color}
          labelStyle={{ fontSize: 12 }}
          onPress={() => {
            getStore().dispatch({
              type: TYPE.SET_IGNORE_SAVED_SESSION,
              payload: true,
            });
          }}
        >
          {t('Log in as another user')}
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
        {t(
          'User registration for {username} is waiting to be confirmed on Nexus blockchain...',
          { username }
        )}
      </Text>
      <InfoField
        label={t('Transaction ID')}
        color={color}
        control={
          <Button
            color={color}
            mode="text"
            icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
            labelStyle={{ fontSize: 12 }}
            onPress={() => {
              Clipboard.setString(txid);
              showNotification(t('Copied to clipboard'));
            }}
          >
            {t('Copy')}
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
        {t('Downloading and Indexing Sigchain...')}
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
      navigation.setOptions(translateTitle(options));
    } else {
      const options = UnauthenticatedBase.stackOptions({
        theme,
        route,
      });
      navigation.setOptions(translateTitle(options));
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

  if (syncingFromScratch && !ignoreSyncScreen)
    return (
      <BaseScreenContainer unStyled>
        <SyncScreen />
      </BaseScreenContainer>
    );

  if (indexing) return <IndexingBase />;

  if (loggedIn && !confirmedUser) return <UnconfirmedUserBase />;

  if (loggedIn)
    return (
      <BaseScreenContainer unStyled>
        <OverviewScreen />
      </BaseScreenContainer>
    );

  if (hasSavedSession && !ignoreSavedSession) return <UnlockingBase />;

  return (
    <BaseScreenContainer unStyled>
      <UnauthenticatedBase />
    </BaseScreenContainer>
  );
}

BaseScreen.nav = {
  name: 'Base',
};
