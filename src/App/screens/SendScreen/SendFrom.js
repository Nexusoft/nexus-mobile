import React from 'react';
import { View } from 'react-native';
import { shadow } from 'react-native-paper';

import Text from 'components/Text';
import AccountPicker from 'components/AccountPicker';
import { useTheme, disabledColor } from 'lib/theme';
import { t } from 'lib/i18n';
import segmentAddress from 'utils/segmentAddress';

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

export default function SendFrom({ account, onChange }) {
  const theme = useTheme();
  const color = theme.dark ? theme.foreground : theme.onPrimary;

  return (
    <View style={styles.wrapper({ theme })}>
      <Text color={color} style={styles.heading}>
        {t('Send from')}
      </Text>
      {!!account && (
        <>
          <AccountPicker
            account={account}
            title={t('Send from')}
            color={color}
            onChange={onChange}
          />
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
