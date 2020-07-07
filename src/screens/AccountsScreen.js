import React from 'react';
import { View, FlatList } from 'react-native';
import { TouchableRipple, FAB } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Text from 'components/Text';
import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import { navigate } from 'lib/navigation';
import { disabledColor } from 'lib/theme';
import segmentAddress from 'utils/segmentAddress';

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
  wrapper: {
    paddingBottom: 106,
  },
  account: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  accName: {
    fontSize: 16,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 12,
  }),
  address: {
    fontSize: 15,
    textAlign: 'center',
  },
  add: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
};

export default function AccountsScreen() {
  const theme = useTheme();
  return (
    <ScreenBody scroll={false} surface style={styles.wrapper}>
      <FlatList
        data={accounts}
        ItemSeparatorComponent={Divider}
        keyExtractor={(acc) => acc.address}
        renderItem={({ item: account }) => (
          <TouchableRipple
            onPress={() => {
              navigate('AccountDetails', { account });
            }}
          >
            <View style={styles.account}>
              <Text style={styles.accName} bold disabled={!account.name}>
                {account.name || 'No name'}
              </Text>
              <View style={styles.addressBox({ theme })}>
                <Text style={styles.address} mono>
                  {segmentAddress(account.address)}
                </Text>
              </View>
            </View>
          </TouchableRipple>
        )}
      />
      <FAB
        style={styles.add}
        icon="plus"
        onPress={() => {
          navigate('NewAccount');
        }}
      />
    </ScreenBody>
  );
}

AccountsScreen.nav = {
  name: 'Accounts',
};
