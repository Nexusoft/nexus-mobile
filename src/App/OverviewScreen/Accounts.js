import React from 'react';
import { View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import TokenName from 'components/TokenName';
import { navigate } from 'lib/navigation';
import { refreshUserAccounts, refreshUserBalances } from 'lib/user';
import { refreshMarketPrice } from 'lib/market';
import { selectSetting } from 'lib/settings';
import { useTheme } from 'lib/theme';
import formatNumber from 'utils/formatNumber';
import useRefresh from 'utils/useRefresh';
import memoize from 'utils/memoize';
import WalletIcon from 'icons/wallet.svg';

const styles = {
  accountsHeader: {
    paddingVertical: 15,
    textTransform: 'uppercase',
    fontSize: 12,
    textAlign: 'center',
  },
  accounts: {
    flex: 1,
    marginBottom: 30,
  },
  account: {
    paddingVertical: 10,
  },
  accInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  accNameIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accIcon: {
    marginRight: 8,
  },
  accName: {
    fontSize: 15,
  },
  accBalance: {
    fontSize: 15,
  },
  accActions: {
    flexDirection: 'row',
  },
  accAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  accActionLabel: ({ theme }) => ({
    fontSize: 12,
    color: theme.dark ? theme.primary : theme.foreground,
  }),
};

function Account({ account }) {
  const theme = useTheme();
  const hideBalances = useSelector(selectSetting('hideBalances'));

  return (
    <View style={styles.account}>
      <TouchableRipple
        onPress={() => {
          navigate('AccountDetails', { address: account.address });
        }}
      >
        <View style={styles.accInfo}>
          <View style={styles.accNameIcon}>
            <SvgIcon icon={WalletIcon} size={14} style={styles.accIcon} />
            <Text style={styles.accName} bold disabled={!account.name}>
              {account.name || 'Unnamed'}
            </Text>
          </View>
          <Text style={styles.accBalance}>
            {hideBalances
              ? '???'
              : formatNumber(account.balance + (account.stake || 0))}{' '}
            <TokenName account={account} />
          </Text>
        </View>
      </TouchableRipple>

      <View style={styles.accActions}>
        <TouchableRipple
          style={styles.accAction}
          onPress={() => {
            navigate('Receive', { account });
          }}
        >
          <Text style={styles.accActionLabel({ theme })}>RECEIVE</Text>
        </TouchableRipple>

        <Divider vertical inset={10} />

        <TouchableRipple
          style={styles.accAction}
          onPress={() => {
            navigate('Send', { account });
          }}
        >
          <Text style={styles.accActionLabel({ theme })}>SEND</Text>
        </TouchableRipple>
      </View>
    </View>
  );
}

const refreshData = () =>
  Promise.all([refreshUserAccounts, refreshUserBalances, refreshMarketPrice]);

export default function Accounts() {
  const hideUnusedTrustAccount = useSelector(
    selectSetting('hideUnusedTrustAccount')
  );
  const accounts = useSelector((state) => state.user.accounts);
  const filteredAccounts = hideUnusedTrustAccount
    ? accounts?.filter(
        (account) => !(account.stake === 0 && account.balance === 0)
      )
    : accounts;
  const [refreshing, refresh] = useRefresh(refreshData);
  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          navigate('Accounts');
        }}
      >
        <Text style={styles.accountsHeader} sub>
          Your Accounts
        </Text>
      </TouchableWithoutFeedback>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        style={styles.accounts}
        data={filteredAccounts}
        keyExtractor={(acc) => acc.address}
        renderItem={({ item: account }) => <Account account={account} />}
        ItemSeparatorComponent={() => <Divider inset={20} />}
      />
    </>
  );
}
