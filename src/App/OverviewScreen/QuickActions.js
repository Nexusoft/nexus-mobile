import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import { navigate } from 'lib/navigation';
import { useTheme } from 'lib/theme';

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 18,
    paddingBottom: 8,
  },
  action: {
    alignItems: 'center',
    width: 76,
    borderRadius: 12,
    paddingVertical: 4,
  },
  circle: ({ theme, disabled }) => ({
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.dark ? '#173445' : '#e3f5fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    opacity: disabled ? 0.4 : 1,
  }),
};

//the account Send / Receive / Scan use when none is picked
export function mainAccount(accounts) {
  if (!accounts?.length) return null;
  return (
    accounts.find((acc) => acc.name === 'default' && acc.token === '0') ||
    accounts.find((acc) => acc.token === '0' && acc.type !== 'TRUST') ||
    accounts[0]
  );
}

function Action({ glyph, label, onPress, disabled }) {
  const theme = useTheme();
  return (
    <TouchableRipple
      style={styles.action}
      borderless
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={{ alignItems: 'center' }}>
        <View style={styles.circle({ theme, disabled })}>
          <Text style={{ color: theme.primary, fontSize: 20 }}>{glyph}</Text>
        </View>
        <Text size={13} bold style={{ color: theme.primary }}>
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
}

export default function QuickActions({ accounts }) {
  const account = mainAccount(accounts);
  return (
    <View style={styles.row}>
      <Action
        glyph={'↗'}
        label="Send"
        disabled={!account}
        onPress={() => navigate('Send', { account })}
      />
      <Action
        glyph={'↙'}
        label="Receive"
        disabled={!account}
        onPress={() => navigate('Receive', { account })}
      />
      <Action
        glyph={'▦'}
        label="Scan QR"
        disabled={!account}
        onPress={() => navigate('Send', { account, scan: true })}
      />
      <Action
        glyph={'⇅'}
        label="History"
        onPress={() => navigate('Transactions')}
      />
    </View>
  );
}
