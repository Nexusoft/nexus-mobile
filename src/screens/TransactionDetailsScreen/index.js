import React from 'react';
import { Clipboard } from 'react-native';
import styled from '@emotion/native';
import moment from 'moment';
import { Button } from 'react-native-paper';

import {
  ScrollView,
  Surface,
  View,
  Text,
  SubText,
  Divider,
} from 'components/Typo';
import SvgIcon from 'components/SvgIcon';
import { showNotification } from 'lib/notifications';
import CopyIcon from 'icons/copy.svg';
import ContractDetails from './ContractDetails';

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingTop: 30,
});

const TxDetails = styled(Surface)({
  elevation: 3,
});

const TxDetailLine = styled.View(
  {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  ({ row }) =>
    row && {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
);

const TxLabel = styled(SubText)({
  fontSize: 14,
});

const TxValue = styled(Text)({
  fontSize: 15,
});

const TxidLabel = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Txid = styled(View)(({ theme }) => ({
  backgroundColor: theme.background,
  borderRadius: 4,
  paddingVertical: 5,
  paddingHorizontal: 8,
  marginTop: 5,
}));

const TxDetail = ({ label, value }) => (
  <TxDetailLine row>
    <TxLabel>{label}</TxLabel>
    <TxValue selectable>{value}</TxValue>
  </TxDetailLine>
);

const SubHeader = styled(SubText)({
  marginLeft: 30,
  marginTop: 30,
  marginBottom: 10,
  textTransform: 'uppercase',
});

const Contracts = styled.View({
  marginBottom: 100,
});

export default function TransactionDetailsScreen({ route }) {
  const {
    params: { transaction },
  } = route;
  return (
    !!transaction && (
      <Wrapper>
        <TxDetails>
          <TxDetailLine>
            <TxidLabel>
              <TxLabel>Transaction ID</TxLabel>
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
            </TxidLabel>
            <Txid>
              <TxValue mono selectable>
                {transaction.txid}
              </TxValue>
            </Txid>
          </TxDetailLine>
          <Divider inset={30} />
          <TxDetail
            label="Time"
            value={moment.unix(transaction.timestamp).format('llll')}
          />
          <Divider inset={30} />
          <TxDetail label="Type" value={transaction.type} />
          <Divider inset={30} />
          <TxDetail label="Sequence" value={transaction.sequence} />
          <Divider inset={30} />
          <TxDetail label="Confirmations" value={transaction.confirmations} />
        </TxDetails>

        <SubHeader>Contracts</SubHeader>
        <Contracts>
          {!!transaction.contracts &&
            transaction.contracts.map((contract) => (
              <ContractDetails key={contract.id} contract={contract} />
            ))}
        </Contracts>
      </Wrapper>
    )
  );
}
