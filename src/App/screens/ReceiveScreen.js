import React from 'react';
import { View, ScrollView, Clipboard, Share, LayoutAnimation } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from 'lib/theme';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import Divider from 'components/Divider';
import TextBox from 'components/TextBox';
import TokenName from 'components/TokenName';
import { showNotification } from 'lib/ui';
import { t } from 'lib/i18n';
import { buildPaymentRequest } from 'lib/paymentRequest';
import parseAmount from 'utils/parseAmount';
import formatNumber from 'utils/formatNumber';
import segmentAddress from 'utils/segmentAddress';
import { flatHeader } from 'utils/styles';
import CopyIcon from 'icons/copy.svg';

const styles = {
  wrapper: ({ theme }) => ({
    backgroundColor: theme.dark ? theme.background : theme.primary,
    flex: 1,
    paddingHorizontal: 20,
  }),
  topInstruction: {
    marginBottom: 30,
    alignItems: 'center',
  },
  main: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 20,
    elevation: 5,
  },
  address: {
    marginTop: 30,
  },
  separator: {
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  separatorLine: {
    flex: 1,
    top: 2,
  },
  separatorLabel: {
    paddingHorizontal: 15,
  },
  requested: {
    marginTop: 10,
  },
  request: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
  requestButton: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
};

export default function ReceiveScreen({ route }) {
  const theme = useTheme();
  const account = route.params?.account;
  const address = account?.address;
  const [requesting, setRequesting] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [reference, setReference] = React.useState('');
  const amountValue = parseAmount(amount);
  const amountValid = amountValue > 0;
  const referenceValid = reference === '' || /^\d+$/.test(reference);
  const link = buildPaymentRequest({
    address,
    amount: requesting && amountValid ? amountValue : undefined,
    reference: requesting && referenceValid ? reference : undefined,
  });
  const ticker = TokenName.from({ account });
  return (
    <ScrollView
      style={styles.wrapper({ theme })}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        paddingTop: 20,
        paddingBottom: 60,
      }}
    >
      <View>
        <Surface style={styles.main}>
          <View style={styles.topInstruction}>
            <Text sub>{t('Show this QR code to the sender')}</Text>
          </View>

          {/* always dark on light, scanners can fail on inverted codes */}
          <QRCode
            value={requesting && amountValid ? link : address}
            size={200}
            color="#000"
            backgroundColor="#fff"
            quietZone={10}
          />

          <Text mono style={styles.address}>
            {segmentAddress(address)}
          </Text>
          {requesting && amountValid && (
            <Text bold style={styles.requested}>
              {reference
                ? t('Requesting {amount} {ticker} (reference {reference})', {
                    amount: formatNumber(amountValue, {
                      maximumFractionDigits: 6,
                    }),
                    ticker,
                    reference,
                  })
                : t('Requesting {amount} {ticker}', {
                    amount: formatNumber(amountValue, {
                      maximumFractionDigits: 6,
                    }),
                    ticker,
                  })}
            </Text>
          )}

          <View style={styles.separator}>
            <Divider style={styles.separatorLine} />
            <Text style={styles.separatorLabel} disabled>
              {t('or')}
            </Text>
            <Divider style={styles.separatorLine} />
          </View>

          <Button
            style={{ alignSelf: 'stretch' }}
            mode="outlined"
            uppercase={false}
            icon={({ size }) => <SvgIcon icon={CopyIcon} size={size} />}
            onPress={() => {
              Clipboard.setString(address);
              showNotification(t('Copied to clipboard'));
            }}
          >
            <Text>{t('Copy account address')}</Text>
          </Button>

          {requesting ? (
            <View style={styles.request}>
              <TextBox
                mode="outlined"
                label={t('Amount to request ({ticker})', { ticker })}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                error={!!amount && !amountValid}
              />
              <TextBox
                mode="outlined"
                label={t('Reference number (optional)')}
                keyboardType="number-pad"
                value={reference}
                onChangeText={setReference}
                error={!referenceValid}
                style={{ marginTop: 10 }}
              />
              <Button
                style={styles.requestButton}
                mode="contained"
                uppercase={false}
                icon="share-variant"
                disabled={!amountValid || !referenceValid}
                onPress={() => {
                  Share.share({ message: link }).catch(() => {});
                }}
              >
                {t('Share payment request')}
              </Button>
            </View>
          ) : (
            <Button
              style={styles.requestButton}
              mode="text"
              uppercase={false}
              icon="cash-plus"
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setRequesting(true);
              }}
            >
              {t('Request a specific amount')}
            </Button>
          )}
        </Surface>
      </View>
    </ScrollView>
  );
}

ReceiveScreen.nav = ({ theme }) => ({
  name: 'Receive',
  options: ({ route }) => ({
    headerTitleAlign: 'center',
    headerTitle: route.params?.account?.name,
    headerStyle: flatHeader(theme),
  }),
});
