import React from 'react';
import { View } from 'react-native';
import { shadow, IconButton, overlay } from 'react-native-paper';
import { useSelector } from 'react-redux';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import { navigate } from 'lib/navigation';
import { useTheme } from 'lib/theme';
import { selectSetting } from 'lib/settings';
import { flatHeader } from 'utils/styles';
import LogoIcon from 'icons/logo-full.svg';
import SettingsIcon from 'icons/settings.svg';
import BalanceSection from './BalanceSection';
import Accounts from './Accounts';
import MenuIcon from 'icons/menu.svg';
import WarningIcon from 'icons/warning-circle.svg';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  accountsPane: ({ theme }) => ({
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: overlay(2, theme.surface),
    elevation: 8,
    ...shadow(8),
  }),
  warningIcon: {
    position: 'absolute',
    top: 10,
    right: 8,
  },
};

export default function OverviewScreen() {
  const theme = useTheme();
  const hideUnusedTrustAccount = useSelector(
    selectSetting('hideUnusedTrustAccount')
  );
  const accounts = useSelector((state) => state.user.accounts);
  const filteredAccounts = hideUnusedTrustAccount
    ? accounts?.filter(
        (account) => !(account.stake === 0 && account.balance === 0)
      )
    : accounts;
  return (
    <View style={styles.wrapper({ theme })}>
      <BalanceSection filteredAccounts={filteredAccounts} />

      <View style={styles.accountsPane({ theme })}>
        <Accounts filteredAccounts={filteredAccounts} />
      </View>
    </View>
  );
}

function SideMenuIcon({ tintColor, theme, navigation }) {
  const hasRecoveryPhrase = useSelector(
    (state) => !!state.user?.status?.recovery
  );

  return (
    <View>
      <IconButton
        icon={({ size }) => (
          <SvgIcon icon={MenuIcon} size={size} color={tintColor} />
        )}
        color={tintColor}
        size={25}
        onPress={() => {
          navigation.openDrawer();
        }}
      />
      {!hasRecoveryPhrase && (
        <SvgIcon
          style={styles.warningIcon}
          icon={WarningIcon}
          size={12}
          color={theme.danger}
        />
      )}
    </View>
  );
}

OverviewScreen.stackOptions = ({ theme, navigation }) => ({
  title: 'Overview',
  headerTitle: () => (
    <SvgIcon
      icon={LogoIcon}
      width={110}
      height={25}
      color={theme.dark ? theme.foreground : theme.onPrimary}
    />
  ),
  headerTitleAlign: 'center',
  headerRight: ({ tintColor }) => (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
      {/* TODO: Remove */}
      <Text style={{ color: tintColor, position: 'relative', paddingTop: 15 }}>
        Beta
      </Text>
      <IconButton
        icon={({ size }) => (
          <SvgIcon icon={SettingsIcon} size={size} color={tintColor} />
        )}
        color={tintColor}
        size={25}
        onPress={() => {
          navigate('Settings');
        }}
      />
    </View>
  ),
  headerLeft: ({ tintColor }) => (
    <SideMenuIcon tintColor={tintColor} theme={theme} navigation={navigation} />
  ),
  headerStyle: flatHeader(theme),
});
