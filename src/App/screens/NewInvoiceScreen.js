import React from 'react';
import { View } from 'react-native';
import { Button, FAB, IconButton, Surface, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import Select from 'components/Select';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import { createInvoice } from 'lib/invoices';
import { mainAccount } from 'lib/user';
import { goBack } from 'lib/navigation';
import { confirmPin, showError, showSuccess } from 'lib/ui';
import formatNumber from 'utils/formatNumber';
import parseAmount from 'utils/parseAmount';
import { shortHash } from './InvoicesScreen';

const styles = {
  wrapper: { paddingHorizontal: 16, paddingVertical: 16 },
  label: { marginTop: 18, marginBottom: 4, textTransform: 'uppercase' },
  item: { padding: 12, borderRadius: 10, elevation: 1, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
};

const emptyItem = () => ({ description: '', price: '', units: '1' });

export default function NewInvoiceScreen() {
  const theme = useTheme();
  const accounts = useSelector((state) =>
    (state.user.accounts || []).filter((a) => a.type !== 'TRUST')
  );
  const [recipient, setRecipient] = React.useState('');
  const [to, setTo] = React.useState(
    () => mainAccount(accounts)?.address || accounts[0]?.address || null
  );
  const [items, setItems] = React.useState([emptyItem()]);
  const [reference, setReference] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const account = accounts.find((a) => a.address === to);
  const ticker = account?.ticker || 'NXS';
  const parsed = items.map((it) => ({
    description: it.description.trim(),
    amount: parseAmount(it.price),
    units: parseAmount(it.units),
  }));
  const itemErrors = parsed.map((it) =>
    !it.description
      ? 'Describe the item'
      : !(it.amount > 0)
      ? 'Enter a price'
      : !(it.units > 0) || !Number.isInteger(it.units)
      ? 'Quantity is a whole number'
      : null
  );
  const total = parsed.reduce(
    (sum, it, i) => (itemErrors[i] ? sum : sum + it.amount * it.units),
    0
  );
  const ready =
    !!recipient.trim() && !!account && itemErrors.every((e) => !e) && !saving;

  const setItem = (i, key, value) =>
    setItems(items.map((it, j) => (j === i ? { ...it, [key]: value } : it)));

  const save = async () => {
    if (!ready) return;
    const pin = await confirmPin({});
    if (!pin) return;
    setSaving(true);
    try {
      await createInvoice({
        to: account.address,
        recipient,
        items: parsed.map(({ description, amount, units }) => ({
          description,
          amount,
          units,
        })),
        reference: reference.trim(),
        pin,
      });
      showSuccess(`Invoice sent to ${recipient.trim()}`);
      goBack();
    } catch (err) {
      showError(err?.message);
      setSaving(false);
    }
  };

  return (
    <ScreenBody style={styles.wrapper}>
      <TextBox
        mode="outlined"
        label="Who pays (username)"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
        autoFocus
      />

      <Text sub size={13} style={styles.label}>
        Paid into
      </Text>
      <Select
        options={accounts.map((a) => ({
          value: a.address,
          display: `${a.name || shortHash(a.address)} (${a.ticker || 'NXS'})`,
        }))}
        value={to}
        updateValue={setTo}
        render={({ display, openSelect }) => (
          <TouchableRipple onPress={openSelect}>
            <Text style={{ color: theme.primary, paddingVertical: 6 }} size={16}>
              {display || 'Pick an account'}
            </Text>
          </TouchableRipple>
        )}
      />

      <Text sub size={13} style={styles.label}>
        Items
      </Text>
      {items.map((it, i) => (
        <Surface key={i} style={styles.item}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextBox
                dense
                mode="outlined"
                label="Description"
                value={it.description}
                onChangeText={(v) => setItem(i, 'description', v)}
              />
            </View>
            {items.length > 1 && (
              <IconButton
                icon="close"
                accessibilityLabel="Remove item"
                onPress={() => setItems(items.filter((_, j) => j !== i))}
              />
            )}
          </View>
          <View style={[styles.row, { marginTop: 6 }]}>
            <View style={{ flex: 2, marginRight: 8 }}>
              <TextBox
                dense
                mode="outlined"
                label={`Price (${ticker})`}
                value={it.price}
                onChangeText={(v) => setItem(i, 'price', v)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextBox
                dense
                mode="outlined"
                label="Quantity"
                value={it.units}
                onChangeText={(v) => setItem(i, 'units', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>
          {!!itemErrors[i] && (it.description || it.price) && (
            <Text size={12} style={{ color: deltaColor('-'), marginTop: 4 }}>
              {itemErrors[i]}
            </Text>
          )}
        </Surface>
      ))}
      <Button
        compact
        style={{ alignSelf: 'flex-start' }}
        onPress={() => setItems([...items, emptyItem()])}
      >
        Add item
      </Button>

      <TextBox
        mode="outlined"
        label="Note (optional)"
        value={reference}
        onChangeText={setReference}
        style={{ marginTop: 12 }}
      />

      <View style={styles.total}>
        <Text bold>Total</Text>
        <Text bold size={17}>
          {`${formatNumber(total, { maximumFractionDigits: 6 })} ${ticker}`}
        </Text>
      </View>

      <FAB
        style={{ marginTop: 20 }}
        mode="contained"
        color={theme.onPrimary}
        disabled={!ready}
        loading={saving}
        onPress={save}
        label="Send invoice"
      />
      <Text sub size={12} style={{ textAlign: 'center', marginTop: 10 }}>
        The payer sees it in their wallet and can pay it with one tap.
      </Text>
      <View style={{ height: 30 }} />
      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

NewInvoiceScreen.nav = {
  name: 'NewInvoice',
  options: {
    title: 'New invoice',
  },
};
