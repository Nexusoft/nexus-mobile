import React from 'react';
import { SectionList, View, ScrollView } from 'react-native';
import { IconButton, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Divider from 'components/Divider';
import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import {
  loadTransactions,
  updateFilter,
  quickFilters,
} from 'lib/transactions';
import { toggleTransactionsFilter } from 'lib/ui';
import { useTheme } from 'lib/theme';
import useRefresh from 'utils/useRefresh';
import TransactionIcon from 'icons/transaction.svg';
import AdjustIcon from 'icons/adjust.svg';
import Filters from './Filters';
import Transaction from './Transaction';

const sameOps = (a, b) =>
  (!a && !b) ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((op) => b.includes(op)));

const styles = {
  chips: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: ({ theme, active }) => ({
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: active
      ? theme.primary
      : theme.dark
      ? theme.surface
      : '#eef2f7',
  }),
  dayHeader: ({ theme }) => ({
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: theme.dark ? theme.background : '#f3f6fa',
  }),
  empty: {
    padding: 30,
    alignItems: 'center',
  },
};

function dayLabel(timestamp) {
  const day = moment.unix(timestamp).startOf('day');
  const today = moment().startOf('day');
  const diff = today.diff(day, 'days');
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return day.format(day.year() === today.year() ? 'D MMMM' : 'D MMMM YYYY');
}

export function groupByDay(transactions) {
  const sections = [];
  for (const tx of transactions || []) {
    const title = dayLabel(tx.timestamp);
    const last = sections[sections.length - 1];
    if (last && last.title === title) {
      last.data.push(tx);
    } else {
      sections.push({ title, data: [tx] });
    }
  }
  return sections;
}

function QuickFilters() {
  const theme = useTheme();
  const operation = useSelector(
    (state) => state.ui.transactionsFilter.operation
  );
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {quickFilters.map(({ label, ops }) => {
          const active = sameOps(operation, ops);
          return (
            <TouchableRipple
              key={label}
              style={styles.chip({ theme, active })}
              borderless
              onPress={() => {
                if (active) return;
                updateFilter({ operation: ops });
                loadTransactions({ reload: true });
              }}
            >
              <Text
                bold={active}
                size={13}
                colorName={active ? 'onPrimary' : 'foreground'}
              >
                {label}
              </Text>
            </TouchableRipple>
          );
        })}
      </ScrollView>
      <Divider />
    </View>
  );
}

export default function TransactionsScreen() {
  const theme = useTheme();
  const { transactions, loading, loaded } = useSelector(
    (state) => state.user.transactions
  );
  const sections = React.useMemo(() => groupByDay(transactions), [
    transactions,
  ]);
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
      <QuickFilters />
      <SectionList
        refreshing={refreshing}
        onRefresh={refresh}
        sections={sections}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <Divider inset={64} />}
        keyExtractor={(tx) => tx.txid}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.dayHeader({ theme })}>
            <Text sub size={12} style={{ textTransform: 'uppercase' }}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => <Transaction transaction={item} />}
        onEndReached={loaded === 'all' ? undefined : () => loadTransactions()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loaded !== 'none' && !loading ? (
            <View style={styles.empty}>
              <Text sub>No transactions here yet.</Text>
            </View>
          ) : null
        }
      />
      {loading && <ActivityIndicator style={{ margin: 10 }} />}
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
