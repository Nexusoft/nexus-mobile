import React from 'react';
import { View } from 'react-native';
import { shadow, IconButton, overlay } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import SvgIcon from 'components/SvgIcon';
import { navigate } from 'lib/navigation';
import HomeIcon from 'icons/home.svg';
import LogoIcon from 'icons/logo-full.svg';
import SettingsIcon from 'icons/settings.svg';
import BalanceSection from './BalanceSection';
import Accounts from './Accounts';

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
};

export default function OverviewScreen() {
  const theme = useTheme();
  return (
    <View style={styles.wrapper({ theme })}>
      <BalanceSection />

      <View style={styles.accountsPane({ theme })}>
        <Accounts />
      </View>
    </View>
  );
}

OverviewScreen.nav = ({ theme }) => ({
  name: 'Overview',
  icon: HomeIcon,
  stackOptions: {
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
    ),
  },
});
