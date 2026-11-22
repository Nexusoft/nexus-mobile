import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, FAB, Surface, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Chip from 'components/Chip';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import {
  fetchOutstanding,
  fetchInvoiceHistory,
  invoiceIssuer,
  invoiceTicker,
  isToMe,
  statusLabel,
} from 'lib/invoices';
import { navigate } from 'lib/navigation';
import { showError } from 'lib/ui';
import formatNumber from 'utils/formatNumber';
import useRefresh from 'utils/useRefresh';
import InvoiceIcon from 'icons/invoice.svg';

const styles = {
  chips: { paddingHorizontal: 14, paddingVertical: 10 },
  card: {
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  cardInner: { padding: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: ({ status }) => ({
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor:
      status === 'PAID' ? '#dcf5e6' : status === 'OUTSTANDING' ? '#fff3d6' : '#e3eaf2',
  }),
  tagText: ({ status }) => ({
    color: status === 'PAID' ? '#1b7a47' : status === 'OUTSTANDING' ? '#a4720a' : '#566175',
  }),
  center: { padding: 30, alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
};

export const shortHash = (hash, n = 6) =>
  hash ? `${hash.slice(0, n)}...${hash.slice(-4)}` : '';

const tabs = [
  { key: 'pay', label: 'To pay' },
  { key: 'sent', label: 'Sent by me' },
  { key: 'history', label: 'Closed' },
];

export function InvoiceTag({ status, toMe }) {
  const label =
    status === 'OUTSTANDING' ? (toMe ? 'TO PAY' : 'WAITING') : (statusLabel[status] || status).toUpperCase();
  return (
    <View style={styles.tag({ status })}>
      <Text size={11} bold style={styles.tagText({ status })}>
        {label}
      </Text>
    </View>
  );
}

function InvoiceCard({ invoice, me, accounts }) {
  const toMe = isToMe(invoice, me);
  const title =
    invoice.items[0]?.description || invoice.reference || shortHash(invoice.address);
  const who = toMe
    ? `from ${shortHash(invoiceIssuer(invoice, me))}`
    : `to ${shortHash(invoice.recipient)}`;
  return (
    <Surface style={styles.card}>
      <TouchableRipple
        style={styles.cardInner}
        onPress={() => navigate('Invoice', { address: invoice.address })}
      >
        <View>
          <View style={styles.top}>
            <Text bold numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
              {title}
            </Text>
            <InvoiceTag status={invoice.status} toMe={toMe} />
          </View>
          <View style={[styles.top, { marginTop: 6 }]}>
            <Text sub size={12}>
              {[who, invoice.created && moment.unix(invoice.created).format('D MMM YYYY')]
                .filter(Boolean)
                .join(' · ')}
            </Text>
            <Text bold>
              {`${formatNumber(invoice.amount, { maximumFractionDigits: 6 })} ${invoiceTicker(invoice, accounts)}`}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
}

export default function InvoicesScreen() {
  const theme = useTheme();
  const me = useSelector((state) => state.user.status?.genesis);
  const accounts = useSelector((state) => state.user.accounts || []);
  const [tab, setTab] = React.useState('pay');
  const [data, setData] = React.useState(null);
  const load = async () => {
    try {
      const [open, all] = await Promise.all([
        fetchOutstanding(),
        fetchInvoiceHistory().catch(() => []),
      ]);
      setData({ open, all });
    } catch (err) {
      setData({ open: [], all: [] });
      showError(err?.message);
    }
  };
  const [refreshing, refresh] = useRefresh(load);
  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  let list = [];
  if (data) {
    if (tab === 'pay') list = data.open.filter((i) => isToMe(i, me));
    else if (tab === 'sent') list = data.open.filter((i) => !isToMe(i, me));
    else {
      const seen = new Set(data.open.map((i) => i.address));
      list = data.all.filter((i) => i.status !== 'OUTSTANDING' && !seen.has(i.address));
    }
    list = [...list].sort((a, b) => (b.created || 0) - (a.created || 0));
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenBody
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {tabs.map((t) => (
            <Chip
              key={t.key}
              label={t.label}
              active={tab === t.key}
              onPress={() => setTab(t.key)}
            />
          ))}
        </ScrollView>
        {!data ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : !list.length ? (
          <View style={styles.center}>
            <Text sub style={{ textAlign: 'center' }}>
              {tab === 'pay'
                ? 'No invoices to pay.'
                : tab === 'sent'
                ? 'No open invoices sent by you.'
                : 'No paid, rejected or cancelled invoices.'}
            </Text>
          </View>
        ) : (
          list.map((invoice) => (
            <InvoiceCard
              key={invoice.address}
              invoice={invoice}
              me={me}
              accounts={accounts}
            />
          ))
        )}
        <View style={{ height: 90 }} />
      </ScreenBody>
      <FAB
        style={styles.fab}
        icon="plus"
        color={theme.onPrimary}
        label="New invoice"
        onPress={() => navigate('NewInvoice')}
      />
    </View>
  );
}

InvoicesScreen.nav = {
  name: 'Invoices',
  icon: InvoiceIcon,
  options: {
    title: 'Invoices',
  },
};
