import React from 'react';
import styled from '@emotion/native';
import moment from 'moment';

import { Text, Divider } from 'components/Typo';
import Contract from './Contract';

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
  fontSize: 21,
});

const Month = styled(Text)({
  fontSize: 14,
});

const Year = styled(Text)({
  fontSize: 12,
});

const Contracts = styled.View({
  flex: 1,
});

export default function Transaction({ transaction }) {
  const txTime = moment.unix(transaction.timestamp);
  return (
    <TransactionWrapper>
      <TxDate>
        <Day>{txTime.format('DD')}</Day>
        <Month>{txTime.format('MMM')}</Month>
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
