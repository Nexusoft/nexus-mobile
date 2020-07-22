import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';

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
  accName: ({ theme }) => ({
    fontSize: 15,
    color: theme.dark ? theme.primary : undefined,
  }),
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
};

export default function Account({ account }) {
  return (
    <>
      <View style={styles.wrapper}>
        <TouchableRipple
          onPress={() => {
            navigate('AccountDetails', { account });
          }}
        >
          <View style={styles.accInfo}>
            <Text style={styles.accName} bold>
              {account.name}
            </Text>
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
            <Text size={11}>RECEIVE</Text>
          </TouchableRipple>

          <Divider vertical inset={10} />

          <TouchableRipple
            style={styles.accAction}
            onPress={() => {
              navigate('Send', { accountName: account.name });
            }}
          >
            <Text size={11}>SEND</Text>
          </TouchableRipple>
        </View>
      </View>
      <Divider />
    </>
  );
}
