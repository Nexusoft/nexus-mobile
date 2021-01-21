import React from 'react';
import { FlatList } from 'react-native';
// import { IconButton } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import Divider from 'components/Divider';
// import SvgIcon from 'components/SvgIcon';
import { loadTransactions } from 'lib/transactions';
import { toggleTransactionsFilter } from 'lib/ui';
import memoize from 'utils/memoize';
import useRefresh from 'utils/useRefresh';
import TransactionIcon from 'icons/transaction.svg';
// import AdjustIcon from 'icons/adjust.svg';
// import Filters from './Filters';
import Transaction from './Transaction';

const selectTransactions = memoize((txMap) =>
  Object.values(txMap).sort((tx1, tx2) => tx2.timestamp - tx1.timestamp)
);

function useLoadMore() {
  const [loading, setLoading] = React.useState(false);
  const loadMore = React.useCallback(async () => {
    setLoading(true);
    try {
      await loadTransactions();
    } finally {
      setLoading(false);
    }
  }, []);
  return [loading, loadMore];
}

export default function TransactionsScreen() {
  const loadedAll = useSelector((state) => state.transactions.loadedAll);
  const transactions = useSelector((state) =>
    selectTransactions(state.transactions.txMap)
  );
  const [refreshing, refresh] = useRefresh(() =>
    loadTransactions({ reload: true })
  );
  const [loadingMore, loadMore] = useLoadMore();
  React.useEffect(() => {
    if (!transactions.length && !loadedAll) {
      loadMore();
    }
  }, []);
  return (
    <ScreenBody surface scroll={false}>
      {/* <Filters /> */}
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        data={transactions}
        ItemSeparatorComponent={Divider}
        keyExtractor={(tx) => tx.txid}
        renderItem={({ item }) => <Transaction transaction={item} />}
        onEndReached={loadedAll ? undefined : loadMore}
        onEndReachedThreshold={0.1}
      />
      {loadingMore && <ActivityIndicator />}
    </ScreenBody>
  );
}

TransactionsScreen.nav = ({ txFilterOpen }) => ({
  name: 'Transactions',
  icon: TransactionIcon,
  stackOptions: {
    title: 'Transactions',
    headerTitle: 'Transactions',
    // headerTitleAlign: 'left',
    headerRight: undefined,
    // ({ tintColor }) => (
    //   <IconButton
    //     icon={({ size }) => (
    //       <SvgIcon icon={AdjustIcon} size={size} color={tintColor} />
    //     )}
    //     color={tintColor}
    //     size={25}
    //     onPress={() => {
    //       toggleTransactionsFilter();
    //     }}
    //   />
    // ),
  },
  // listeners: {
  //   blur: () => {
  //     if (txFilterOpen) {
  //       toggleTransactionsFilter();
  //     }
  //   },
  // },
});
