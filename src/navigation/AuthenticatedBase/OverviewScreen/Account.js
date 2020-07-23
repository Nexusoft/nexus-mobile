import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import { useTheme } from 'lib/theme';

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
    // color: theme.dark ? theme.primary : undefined,
  }),
  accBalance: ({ theme }) => ({
    fontSize: 15,
    // color: theme.dark ? theme.primary : undefined,
  }),
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
            <Text style={styles.accName({ theme })} bold>
              {account.name}
            </Text>
            <Text style={styles.accBalance({ theme })}>
              {account.balance} NXS
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
