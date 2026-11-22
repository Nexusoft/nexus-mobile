import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Surface, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Select from 'components/Select';
import Text from 'components/Text';
import Divider from 'components/Divider';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import {
  fetchInvoice,
  payInvoice,
  rejectInvoice,
  cancelInvoice,
  invoiceIssuer,
  invoiceTicker,
  isToMe,
  statusLabel,
} from 'lib/invoices';
import { refreshUserAccounts, refreshUserBalances } from 'lib/user';
import { goBack } from 'lib/navigation';
import { confirm, confirmPin, showError, showSuccess } from 'lib/ui';
import formatNumber from 'utils/formatNumber';
import { InvoiceTag, shortHash } from './InvoicesScreen';

const styles = {
  card: {
    marginHorizontal: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actions: { flexDirection: 'row', marginTop: 14 },
  center: { padding: 30, alignItems: 'center' },
};

const num = (n) => formatNumber(n, { maximumFractionDigits: 6 });

function Line({ label, value, mono }) {
  return (
    <View style={styles.line}>
      <Text sub>{label}</Text>
      <Text mono={mono} style={{ flexShrink: 1, textAlign: 'right', marginLeft: 12 }}>
        {value}
      </Text>
    </View>
  );
}

export default function InvoiceScreen({ route }) {
  const theme = useTheme();
  const address = route.params?.address;
  const me = useSelector((state) => state.user.status?.genesis);
  const accounts = useSelector((state) => state.user.accounts || []);
  const [invoice, setInvoice] = React.useState(null);
  const [from, setFrom] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    fetchInvoice(address)
      .then(setInvoice)
      .catch((err) => showError(err?.message));
  }, [address]);

  const usable = React.useMemo(
    () =>
      invoice
        ? accounts
            .filter(
              (a) => a.type !== 'TRUST' && (a.token || '0') === invoice.token
            )
            .sort((x, y) => (y.balance || 0) - (x.balance || 0))
        : [],
    [invoice, accounts]
  );
  React.useEffect(() => {
    if (!from && usable.length) setFrom(usable[0].address);
  }, [usable]);

  if (!invoice) {
    return (
      <ScreenBody>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </ScreenBody>
    );
  }

  const ticker = invoiceTicker(invoice, accounts);
  const toMe = isToMe(invoice, me);
  const issuer = invoiceIssuer(invoice, me);
  const mine = !toMe && !!me && issuer?.toLowerCase() === me.toLowerCase();
  const open = invoice.status === 'OUTSTANDING';
  const account = usable.find((a) => a.address === from);
  const tooMuch = !!account && invoice.amount > (account.balance || 0);

  const run = async (action, done) => {
    const pin = await confirmPin({});
    if (!pin) return;
    setBusy(true);
    try {
      await action(pin);
      refreshUserAccounts();
      refreshUserBalances();
      showSuccess(done);
      goBack();
    } catch (err) {
      showError(err?.message);
      setBusy(false);
    }
  };

  return (
    <ScreenBody>
      <Surface style={styles.card}>
        <View style={[styles.line, { marginBottom: 12 }]}>
          <Text bold size={17} style={{ flex: 1, marginRight: 8 }}>
            {invoice.items[0]?.description || 'Invoice'}
          </Text>
          <InvoiceTag status={invoice.status} toMe={toMe} />
        </View>
        <Line label={toMe ? 'From' : 'Issued by'} value={mine ? 'You' : shortHash(issuer, 8)} mono={!mine} />
        <Line label="Payer" value={toMe ? 'You' : shortHash(invoice.recipient, 8)} mono={!toMe} />
        <Line label="Paid into" value={invoice.to && invoice.to.length < 40 ? invoice.to : shortHash(invoice.to || invoice.account, 8)} />
        {!!invoice.created && (
          <Line label="Date" value={moment.unix(invoice.created).format('D MMM YYYY HH:mm')} />
        )}
        {!!invoice.reference && <Line label="Note" value={invoice.reference} />}
        <Line label="Status" value={statusLabel[invoice.status] || invoice.status} />
      </Surface>

      <Surface style={styles.card}>
        {invoice.items.map((item, i) => (
          <View key={i} style={styles.line}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text>{item.description || '-'}</Text>
              <Text sub size={12}>
                {`${item.units} x ${num(item.amount)}`}
              </Text>
            </View>
            <Text>{num(item.amount * item.units)}</Text>
          </View>
        ))}
        <Divider />
        <View style={[styles.line, { marginTop: 8, marginBottom: 0 }]}>
          <Text bold>Total</Text>
          <Text bold size={17}>{`${num(invoice.amount)} ${ticker}`}</Text>
        </View>
      </Surface>

      {open && toMe && (
        <Surface style={styles.card}>
          {usable.length ? (
            <>
              <Select
                options={usable.map((a) => ({
                  value: a.address,
                  display: `${a.name || shortHash(a.address)}  ${num(a.balance || 0)} ${a.ticker || ticker}`,
                }))}
                value={from}
                updateValue={setFrom}
                render={({ display, openSelect }) => (
                  <TouchableRipple onPress={openSelect}>
                    <View>
                      <Text sub size={12}>
                        Pay from
                      </Text>
                      <Text style={{ color: theme.primary, paddingVertical: 4 }}>
                        {display}
                      </Text>
                    </View>
                  </TouchableRipple>
                )}
              />
              {tooMuch && (
                <Text size={12} style={{ color: deltaColor('-') }}>
                  Not enough in this account
                </Text>
              )}
            </>
          ) : (
            <Text size={13} style={{ color: deltaColor('-') }}>
              {`You have no ${ticker} account to pay this from.`}
            </Text>
          )}
          <View style={styles.actions}>
            <Button
              mode="contained"
              style={{ flex: 1, marginRight: 10 }}
              labelStyle={{ color: theme.onPrimary }}
              disabled={busy || !account || tooMuch}
              loading={busy}
              onPress={() =>
                run((pin) => payInvoice(invoice.address, from, pin), 'Invoice paid')
              }
            >
              Pay
            </Button>
            <Button
              mode="outlined"
              style={{ flex: 1 }}
              disabled={busy}
              onPress={async () => {
                if (
                  await confirm({
                    title: 'Reject this invoice?',
                    message: 'The issuer sees it as rejected and it cannot be paid any more.',
                    confirmLabel: 'Reject',
                    danger: true,
                  })
                ) {
                  run((pin) => rejectInvoice(invoice.address, pin), 'Invoice rejected');
                }
              }}
            >
              Reject
            </Button>
          </View>
        </Surface>
      )}

      {open && mine && (
        <Surface style={styles.card}>
          <Text sub size={13}>
            Waiting for the payer. You can cancel it while it is not paid.
          </Text>
          <Button
            mode="outlined"
            style={{ marginTop: 12 }}
            color={theme.danger}
            disabled={busy}
            loading={busy}
            onPress={async () => {
              if (
                await confirm({
                  title: 'Cancel this invoice?',
                  confirmLabel: 'Cancel invoice',
                  cancelLabel: 'Keep it',
                  danger: true,
                })
              ) {
                run((pin) => cancelInvoice(invoice.address, pin), 'Invoice cancelled');
              }
            }}
          >
            Cancel invoice
          </Button>
        </Surface>
      )}
      <View style={{ height: 30 }} />
    </ScreenBody>
  );
}

InvoiceScreen.nav = {
  name: 'Invoice',
  options: {
    title: 'Invoice',
  },
};
