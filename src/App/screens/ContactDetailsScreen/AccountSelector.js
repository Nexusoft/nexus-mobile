import React from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TouchableRipple } from 'react-native-paper';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import Divider from 'components/Divider';
import { useTheme, disabledColor } from 'lib/theme';
import segmentAddress from 'utils/segmentAddress';

import WalletIcon from 'icons/wallet.svg';

const styles = {
  wrapper: {
    marginHorizontal: -24,
  },
  account: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  accNameLine: { flexDirection: 'row', alignItems: 'center' },
  accName: {
    fontSize: 16,
    marginLeft: 8,
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
    fontSize: 13,
    textAlign: 'center',
  },
};

export default function AccountSelector({ onSelectAccount, ...rest }) {
  const accounts = useSelector((state) => state.user?.accounts);
  const theme = useTheme();
  return (
    <Portal>
      <Dialog {...rest}>
        <Dialog.Title>
          <Text>Account to send from</Text>
        </Dialog.Title>
        <Dialog.Content>
          <FlatList
            style={styles.wrapper}
            data={accounts}
            ItemSeparatorComponent={() => <Divider inset={24} />}
            keyExtractor={(contact) => contact.name}
            renderItem={({ item: account }) => (
              <TouchableRipple
                onPress={() => {
                  onSelectAccount(account);
                }}
              >
                <View style={styles.account}>
                  <View style={styles.accNameLine}>
                    <SvgIcon
                      icon={WalletIcon}
                      size={16}
                      disabled={!account.name}
                    />
                    <Text style={styles.accName} bold disabled={!account.name}>
                      {account.name || 'Unnamed'}
                    </Text>
                  </View>

                  <View style={styles.addressBox({ theme })}>
                    <Text style={styles.address} mono>
                      {segmentAddress(account.address)}
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            )}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
