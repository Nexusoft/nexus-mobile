import React from 'react';
import { View } from 'react-native';
import { Button, overlay, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import TokenName from 'components/TokenName';
import AddressPicker from 'components/AddressPicker';
import { useTheme } from 'lib/theme';
import { t } from 'lib/i18n';
import formatNumber from 'utils/formatNumber';
import parseAmount from 'utils/parseAmount';
import { selectSetting } from 'lib/settings';
import { selectMarketPrice } from 'lib/market';
import { parsePaymentRequest } from 'lib/paymentRequest';
import { addressRegex } from 'consts/regex';
import segmentAddress from 'utils/segmentAddress';

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
  requestLabel: {
    textAlign: 'center',
    marginTop: -20,
    marginBottom: 20,
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
  preview: ({ theme }) => ({
    marginTop: -12,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : '#eef4fa',
  }),
  fiat: {
    marginTop: 4,
    marginLeft: 4,
  },
  advancedToggle: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
};

const maxContactShortcuts = 5;

//a long address does not fit the one line field, show it whole and grouped below
function RecipientPreview({ value }) {
  const theme = useTheme();
  const text = value?.trim();
  if (!text || !addressRegex.test(text)) return null;
  return (
    <View style={styles.preview({ theme })}>
      <Text mono size={14} style={{ textAlign: 'center' }}>
        {segmentAddress(text)}
      </Text>
    </View>
  );
}

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
          accessibilityLabel={t('Send to {name}', { name })}
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
  const price = useSelector(selectMarketPrice);
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
  const [advancedOpen, setAdvancedOpen] = React.useState(!!values?.reference);
  const applyRequest = (request) => {
    setFieldValue('nameOrAddress', request.address);
    if (request.amount) setFieldValue('amount', request.amount);
    if (request.reference) {
      setFieldValue('reference', request.reference);
      setAdvancedOpen(true);
    }
    setFieldValue('requestLabel', request.label || '');
  };
  //a link pasted or typed straight into the field
  React.useEffect(() => {
    const request = parsePaymentRequest(values?.nameOrAddress);
    if (request) applyRequest(request);
  }, [values?.nameOrAddress]);

  return (
    <View style={styles.wrapper({ theme })}>
      <Text style={styles.heading}>{t('Send to')}</Text>
      {!!values?.requestLabel && (
        <Text sub style={styles.requestLabel}>
          {t('Payment request: {label}', { label: values.requestLabel })}
        </Text>
      )}

      <ContactShortcuts setFieldValue={setFieldValue} />
      <View style={styles.section}>
        <TextBox.Formik
          name="nameOrAddress"
          mode="outlined"
          background={['surface', 2]}
          label={t('Recipient name/address')}
          blurOnSubmit
        />
        <RecipientPreview value={values?.nameOrAddress} />
        <AddressPicker
          autoScan={autoScan}
          setAddress={(address, request) => {
            setFieldValue('nameOrAddress', address);
            if (request) applyRequest(request);
          }}
        />
      </View>

      <View style={styles.section}>
        <TextBox.Formik
          name="amount"
          mode="outlined"
          background={['surface', 2]}
          label={t('Amount ({ticker})', { ticker: TokenName.from({ account }) })}
          decimal
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
          {t('Max ({amount} {ticker})', {
            amount: formatNumber(account.balance, { maximumFractionDigits: 6 }),
            ticker: TokenName.from({ account }),
          })}
        </Button>
      </View>

      <View style={styles.section}>
        <Button
          mode="text"
          compact
          icon={advancedOpen ? 'chevron-down' : 'chevron-right'}
          style={styles.advancedToggle}
          labelStyle={{ fontSize: 12 }}
          onPress={() => setAdvancedOpen(!advancedOpen)}
        >
          {t('Advanced options')}
        </Button>

        {/* mounted when shown: a field measured while hidden or animating draws no label until focused */}
        {advancedOpen && (
          <TextBox.Formik
            name="reference"
            mode="outlined"
            background={['surface', 2]}
            label={t('Reference number (optional)')}
            keyboardType="number-pad"
          />
        )}
      </View>
    </View>
  );
}
