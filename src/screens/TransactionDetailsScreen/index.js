import React from 'react';
import styled from '@emotion/native';

import { ScrollView, SubText } from 'components/Typo';
import TransactionDetails from './TransactionDetails';
import ContractDetails from './ContractDetails';

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingTop: 30,
});

const SubHeader = styled(SubText)({
  marginLeft: 30,
  marginTop: 30,
  marginBottom: 10,
  textTransform: 'uppercase',
});

const Inner = styled.View({
  paddingBottom: 100,
});

export default function TransactionDetailsScreen({ route }) {
  const {
    params: { transaction },
  } = route;
  return (
    !!transaction && (
      <Wrapper>
        <Inner>
          <TransactionDetails transaction={transaction} />

          <SubHeader>Contracts</SubHeader>
          {!!transaction.contracts &&
            transaction.contracts.map((contract) => (
              <ContractDetails key={contract.id} contract={contract} />
            ))}
        </Inner>
      </Wrapper>
    )
  );
}
