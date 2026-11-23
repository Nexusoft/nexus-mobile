import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { Button, overlay, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import TokenName from 'components/TokenName';
import AddressPicker from 'components/AddressPicker';
import { useTheme } from 'lib/theme';
import formatNumber from 'utils/formatNumber';
import parseAmount from 'utils/parseAmount';
import { selectSetting } from 'lib/settings';

const styles = {
  wrapper: ({ theme }) => ({
    flex: 1,
    backgroundColor: overlay(2, theme.surface),
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 50,
  }),
  heading: {
    textTransform: 'uppercase',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.75,
  },
  sendAll: {
    alignSelf: 'flex-end',
    marginTop: -15,
  },
  section: {
    marginBottom: 30,
  },
  contacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  contact: {
    alignItems: 'center',
    width: 64,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 10,
  },
  avatar: ({ theme }) => ({
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.dark ? '#173445' : '#e3f5fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  }),
  fiat: {
    marginTop: 4,
    marginLeft: 4,
  },
  advancedToggle: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  advancedOptions: ({ expanded }) => ({
    // setting height to 0 makes text have the stretch effect
    // setting height to > 0 makes text have the revealing effect (on Android)
    height: expanded ? undefined : 0.01,
    overflow: 'hidden',
    alignSelf: 'stretch',
  }),
};

const maxContactShortcuts = 5;

function ContactShortcuts({ setFieldValue }) {
  const theme = useTheme();
  const contacts = useSelector((state) => state.contacts);
  const list = Object.entries(contacts || {}).slice(0, maxContactShortcuts);
  if (!list.length) return null;
  return (
    <View style={styles.contacts}>
      {list.map(([name, { address }]) => (
        <TouchableRipple
          key={name}
          style={styles.contact}
          borderless
          onPress={() => setFieldValue('nameOrAddress', address)}
          accessibilityLabel={'Send to ' + name}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={styles.avatar({ theme })}>
              <Text bold style={{ color: theme.primary }}>
                {name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <Text size={12} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </TouchableRipple>
      ))}
    </View>
  );
}

function FiatValue({ account, amount }) {
  const price = useSelector((state) => state.market.price);
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const value = parseAmount(amount);
  if (account?.token !== '0' || !price || !(value > 0)) return null;
  return (
    <Text sub size={13} style={styles.fiat}>
      {'≈ '}
      {formatNumber(value * price, { maximumFractionDigits: 2 })} {baseCurrency}
    </Text>
  );
}

export default function SendTo({ account, setFieldValue, autoScan, values }) {
  const theme = useTheme();
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  return (
    <View style={styles.wrapper({ theme })}>
      <Text style={styles.heading}>Send to</Text>

      <ContactShortcuts setFieldValue={setFieldValue} />
      <View style={styles.section}>
        <TextBox.Formik
          multiline
          name="nameOrAddress"
          mode="outlined"
          background={['surface', 2]}
          label="Recipient name/address"
          blurOnSubmit
        />
        <AddressPicker
          autoScan={autoScan}
          setAddress={(address) => {
            setFieldValue('nameOrAddress', address);
          }}
        />
      </View>

      <View style={styles.section}>
        <TextBox.Formik
          name="amount"
          mode="outlined"
          background={['surface', 2]}
          label={`Amount (${TokenName.from({ account })})`}
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <FiatValue account={account} amount={values?.amount} />
        <Button
          mode="text"
          style={styles.sendAll}
          onPress={() => {
            setFieldValue('amount', String(account.balance));
          }}
          labelStyle={{ fontSize: 12 }}
        >
          Max (
          {formatNumber(account.balance, { maximumFractionDigits: 6 })}{' '}
          {TokenName.from({ account })})
        </Button>
      </View>

      <View style={styles.section}>
        <Button
          mode="text"
          compact
          icon={advancedOpen ? 'chevron-down' : 'chevron-right'}
          style={styles.advancedToggle}
          labelStyle={{ fontSize: 12 }}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setAdvancedOpen(!advancedOpen);
          }}
        >
          Advanced options
        </Button>

        <View style={styles.advancedOptions({ expanded: advancedOpen })}>
          <TextBox.Formik
            name="reference"
            mode="outlined"
            background={['surface', 2]}
            label="Reference number (optional)"
            keyboardType="number-pad"
          />
        </View>
      </View>
    </View>
  );
}
