import React from 'react';
import { Clipboard, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Button, Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import { showNotification } from 'lib/ui';
import { t } from 'lib/i18n';
import CopyIcon from 'icons/copy.svg';

const styles = {
  wrapper: {
    elevation: 3,
    paddingHorizontal: 30,
  },
};

const explorerUrl = 'https://explorer.nexus.io';

export default function TransactionDetails({ transaction }) {
  const mainnet = useSelector(
    (state) => !state.core.info?.testnet && !state.core.info?.private
  );
  return (
    <Surface style={styles.wrapper}>
      <InfoField
        label={t('Transaction ID')}
        control={
          <Button
            mode="text"
            icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
            labelStyle={{ fontSize: 12 }}
            onPress={() => {
              Clipboard.setString(transaction.txid);
              showNotification(t('Copied to clipboard'));
            }}
          >
            {t('Copy')}
          </Button>
        }
        value={transaction.txid}
        mono
        bordered
      />
      <Divider />
      <InfoField
        inline
        label={t('Time')}
        value={moment.unix(transaction.timestamp).format('llll')}
      />
      <Divider />
      <InfoField inline label={t('Type')} value={transaction.type} />
      <Divider />
      <InfoField
        inline
        label={t('Sequence')}
        value={transaction.sequence}
      />
      <Divider />
      <InfoField
        inline
        label={t('Confirmations')}
        value={transaction.confirmations}
      />
      {mainnet && (
        <>
          <Divider />
          <Button
            mode="text"
            style={{ marginVertical: 8 }}
            onPress={() => {
              Linking.openURL(`${explorerUrl}/scan/${transaction.txid}`);
            }}
          >
            {t('View on explorer')}
          </Button>
        </>
      )}
    </Surface>
  );
}
