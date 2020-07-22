import React from 'react';
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { shadow, IconButton } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import { navigate } from 'lib/navigation';
import HomeIcon from 'icons/home.svg';
import LogoIcon from 'icons/logo-full.svg';
import SettingsIcon from 'icons/settings.svg';
import BalanceSection from './BalanceSection';
import Account from './Account';

const accounts = [
  {
    created: 1573539403,
    modified: 1589688048,
    name: 'default',
    address: '8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW',
    token_name: 'NXS',
    token: '0',
    balance: 0,
    pending: 0,
    unconfirmed: 0,
  },
  {
    created: 1573539403,
    modified: 1591674440,
    name: 'trust',
    address: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
    token_name: 'NXS',
    token: '0',
    balance: 44.745334,
    pending: 0,
    unconfirmed: 0,
    stake: 40397,
  },
];

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  accountsPane: ({ theme }) => ({
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 40,
    backgroundColor: theme.surface,
    elevation: 8,
    ...shadow(8),
  }),
  accountsHeader: {
    paddingVertical: 15,
    textTransform: 'uppercase',
    fontSize: 12,
    textAlign: 'center',
  },
  accounts: {
    flex: 1,
  },
};

export default function OverviewScreen() {
  const theme = useTheme();
  return (
    <View style={styles.wrapper({ theme })}>
      <BalanceSection />

      <View style={styles.accountsPane({ theme })}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigate('Accounts');
          }}
        >
          <Text style={styles.accountsHeader} sub>
            Accounts
          </Text>
        </TouchableWithoutFeedback>
        <ScrollView style={styles.accounts}>
          {accounts.map((account) => (
            <Account key={account.address} account={account} />
          ))}
        </ScrollView>
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
