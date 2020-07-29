import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import { navigate } from 'lib/navigation';
import { useTheme } from 'lib/theme';
import WalletIcon from 'icons/wallet.svg';

const styles = {
  wrapper: {
    marginVertical: 10,
  },
  accInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
    fontSize: 11,
    color: theme.dark ? theme.primary : undefined,
  }),
};

export default function Account({ account }) {
  const theme = useTheme();
  return (
    <>
      <View style={styles.wrapper}>
        <TouchableRipple
          onPress={() => {
            navigate('AccountDetails', { account });
          }}
        >
          <View style={styles.accInfo}>
            <View style={styles.accNameIcon}>
              <SvgIcon icon={WalletIcon} size={14} style={styles.accIcon} />
              <Text style={styles.accName} bold>
                {account.name}
              </Text>
            </View>
            <Text style={styles.accBalance}>{account.balance} NXS</Text>
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
              navigate('Send', { accountName: account.name });
            }}
          >
            <Text style={styles.accActionLabel({ theme })}>SEND</Text>
          </TouchableRipple>
        </View>
      </View>
      <Divider />
    </>
  );
}
