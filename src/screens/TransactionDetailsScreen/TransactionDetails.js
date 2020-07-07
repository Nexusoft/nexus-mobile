import React from 'react';
import { Clipboard } from 'react-native';
import styled from '@emotion/native';
import moment from 'moment';
import { Button, Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import { showNotification } from 'lib/ui';
import CopyIcon from 'icons/copy.svg';

const TxDetails = styled(Surface)({
  elevation: 3,
  paddingHorizontal: 30,
});

export default function TransactionDetails({ transaction }) {
  return (
    <TxDetails>
      <InfoField
        label="Transaction ID"
        control={
          <Button
            mode="text"
            icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
            labelStyle={{ fontSize: 12 }}
            onPress={() => {
              Clipboard.setString(transaction.txid);
              showNotification('Copied to clipboard');
            }}
          >
            Copy
          </Button>
        }
        value={transaction.txid}
        mono
        bordered
      />
      <Divider />
      <InfoField
        inline
        label="Time"
        value={moment.unix(transaction.timestamp).format('llll')}
      />
      <Divider />
      <InfoField inline label="Type" value={transaction.type} />
      <Divider />
      <InfoField inline label="Sequence" value={transaction.sequence} />
      <Divider />
      <InfoField
        inline
        label="Confirmations"
        value={transaction.confirmations}
      />
    </TxDetails>
  );
}
