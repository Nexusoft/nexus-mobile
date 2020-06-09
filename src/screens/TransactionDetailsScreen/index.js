import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import { SubText } from 'components/Typo';
import TransactionDetails from './TransactionDetails';
import ContractDetails from './ContractDetails';

const Wrapper = styled(ScrollView)({
  flex: 1,
});

const SubHeader = styled(SubText)({
  marginLeft: 30,
  marginTop: 30,
  marginBottom: 10,
  textTransform: 'uppercase',
});

export default function TransactionDetailsScreen({ route }) {
  const {
    params: { transaction },
  } = route;
  return (
    !!transaction && (
      <Wrapper>
        <SafeAreaView>
          <TransactionDetails transaction={transaction} />

          <SubHeader>Contracts</SubHeader>
          {!!transaction.contracts &&
            transaction.contracts.map((contract) => (
              <ContractDetails key={contract.id} contract={contract} />
            ))}
        </SafeAreaView>
      </Wrapper>
    )
  );
}
