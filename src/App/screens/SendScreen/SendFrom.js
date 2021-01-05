import React from 'react';
import { View } from 'react-native';
import { shadow } from 'react-native-paper';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme, disabledColor } from 'lib/theme';
import segmentAddress from 'utils/segmentAddress';
import WalletIcon from 'icons/wallet.svg';

const styles = {
  wrapper: ({ theme }) => ({
    backgroundColor: theme.dark ? theme.background : theme.primary,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
    elevation: 4,
    ...shadow(4),
  }),
  heading: {
    textTransform: 'uppercase',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.75,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.dark ? theme.foreground : theme.onPrimary),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 10,
  }),
  address: {
    fontSize: 15,
    textAlign: 'center',
  },
};

export default function SendFrom({ account }) {
  const theme = useTheme();
  const color = theme.dark ? theme.foreground : theme.onPrimary;

  return (
    <View style={styles.wrapper({ theme })}>
      <Text color={color} style={styles.heading}>
        Send from
      </Text>
      {!!account && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgIcon
              icon={WalletIcon}
              size={16}
              color={color}
              style={{ marginRight: 8 }}
              disabled={!account.name}
            />
            <Text bold color={color} size={16} disabled={!account.name}>
              {account.name || 'Unnamed'}
            </Text>
          </View>
          <View style={styles.addressBox({ theme })}>
            <Text mono color={color} style={styles.address}>
              {segmentAddress(account.address)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
