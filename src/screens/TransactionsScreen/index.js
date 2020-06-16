import React from 'react';
import { FlatList } from 'react-native';
import styled from '@emotion/native';

import { Surface, Divider } from 'components/Typo';
import Filters from './Filters';
import Transaction from './Transaction';
import transactions from './transactions';

const Wrapper = styled(Surface)({
  flex: 1,
  elevation: 0,
});

export default function TransactionsScreen() {
  return (
    <Wrapper>
      <Filters />
      <FlatList
        data={transactions}
        ItemSeparatorComponent={Divider}
        keyExtractor={(tx) => tx.txid}
        renderItem={({ item }) => <Transaction transaction={item} />}
      />
    </Wrapper>
  );
}
