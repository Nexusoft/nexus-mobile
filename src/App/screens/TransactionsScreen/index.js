import React from 'react';
import { VirtualizedList } from 'react-native';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import { loadTransactions } from 'lib/transactions';
import { toggleTransactionsFilter } from 'lib/ui';
import useRefresh from 'utils/useRefresh';
import TransactionIcon from 'icons/transaction.svg';
import AdjustIcon from 'icons/adjust.svg';
import Filters from './Filters';
import Transaction from './Transaction';

export default function TransactionsScreen() {
  const { transactions, loading, loaded } = useSelector(
    (state) => state.user.transactions
  );
  const [refreshing, refresh] = useRefresh(() =>
    loadTransactions({ reload: true })
  );

  React.useEffect(() => {
    if (loaded === 'none') {
      loadTransactions();
    }
  }, []);
  return (
    <ScreenBody surface scroll={false}>
      <Filters />
      <VirtualizedList
        refreshing={refreshing}
        onRefresh={refresh}
        data={transactions}
        getItemCount={(data) => data.length}
        getItem={(data, i) => data[i]}
        ItemSeparatorComponent={Divider}
        keyExtractor={(tx) => tx.txid}
        renderItem={({ item }) => <Transaction transaction={item} />}
        onEndReached={loaded === 'all' ? undefined : () => loadTransactions()}
        onEndReachedThreshold={0.5}
      />
      {loading && <ActivityIndicator />}
    </ScreenBody>
  );
}

TransactionsScreen.nav = ({ txFilterOpen }) => ({
  name: 'Transactions',
  icon: TransactionIcon,
  options: {
    title: 'Transactions',
    headerTitle: 'Transactions',
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
