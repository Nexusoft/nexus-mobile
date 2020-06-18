import React from 'react';
import { FlatList } from 'react-native';

import ScreenBody from 'components/ScreenBody';
import { Divider } from 'components/Adaptive';
import Filters from './Filters';
import Transaction from './Transaction';
import transactions from './transactions';

export default function TransactionsScreen() {
  return (
    <ScreenBody surface scroll={false}>
      <Filters />
      <FlatList
        data={transactions}
        ItemSeparatorComponent={Divider}
        keyExtractor={(tx) => tx.txid}
        renderItem={({ item }) => <Transaction transaction={item} />}
      />
    </ScreenBody>
  );
}
