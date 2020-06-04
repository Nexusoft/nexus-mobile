import React from 'react';
import styled from '@emotion/native';

import { Text, Divider } from 'components/Typo';
import Contract from './Contract';

const dayFormat = new Intl.DateTimeFormat('en', { day: '2-digit' });
const monthFormat = new Intl.DateTimeFormat('en', { month: 'short' });

const TransactionWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const TxDate = styled.View({
  paddingVertical: 20,
  width: 80,
  alignItems: 'center',
  justifyContent: 'center',
});

const Day = styled(Text)({
  fontSize: 23,
});

const Month = styled(Text)({
  fontSize: 15,
});

const Year = styled(Text)({
  fontSize: 12,
});

const Contracts = styled.View({
  flex: 1,
});

export default function Transaction({ transaction }) {
  const txTime = new Date(transaction.timestamp * 1000);
  return (
    <TransactionWrapper>
      <TxDate>
        <Day>{dayFormat.format(txTime)}</Day>
        <Month>{monthFormat.format(txTime)}</Month>
      </TxDate>

      <Contracts>
        {transaction.contracts.map((contract, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <Divider />}
            <Contract contract={contract} />
          </React.Fragment>
        ))}
      </Contracts>
    </TransactionWrapper>
  );
}
