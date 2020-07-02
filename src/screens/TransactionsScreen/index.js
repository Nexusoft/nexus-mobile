import React from 'react';
import { FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import { toggleTransactionsFilter } from 'lib/ui';
import TransactionIcon from 'icons/transaction.svg';
import AdjustIcon from 'icons/adjust.svg';
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

TransactionsScreen.nav = ({ txFilterOpen }) => ({
  name: 'Transactions',
  icon: TransactionIcon,
  stackOptions: {
    title: 'Transactions',
    headerTitleAlign: 'left',
    headerRight: ({ tintColor }) => (
      <IconButton
        icon={({ size }) => (
          <SvgIcon icon={AdjustIcon} size={size} color={tintColor} />
        )}
        color={tintColor}
        size={25}
        onPress={() => {
          toggleTransactionsFilter();
        }}
      />
    ),
  },
  listeners: {
    blur: () => {
      if (txFilterOpen) {
        toggleTransactionsFilter();
      }
    },
  },
});
