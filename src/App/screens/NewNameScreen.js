import React from 'react';
import { View } from 'react-native';
import { FAB, RadioButton, Surface, TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import Select from 'components/Select';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import {
  nameFee,
  nameIsFree,
  nameProblem,
  createName,
} from 'lib/names';
import { mainAccount, selectUsername, refreshUserAccounts } from 'lib/user';
import { goBack } from 'lib/navigation';
import { confirmPin, showError, showSuccess } from 'lib/ui';
import { t } from 'lib/i18n';

const styles = {
  wrapper: { paddingHorizontal: 20, paddingVertical: 20 },
  label: { marginTop: 18, marginBottom: 6, textTransform: 'uppercase' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preview: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
};

const short = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-5)}` : '';

export default function NewNameScreen() {
  const theme = useTheme();
  const username = useSelector(selectUsername);
  const accounts = useSelector((state) =>
    (state.user.accounts || []).filter((a) => a.type !== 'TRUST')
  );
  const [name, setName] = React.useState('');
  const [global, setGlobal] = React.useState(false);
  const [register, setRegister] = React.useState(
    () => mainAccount(accounts)?.address || accounts[0]?.address || null
  );
  const [free, setFree] = React.useState(undefined);
  const [saving, setSaving] = React.useState(false);
  const trimmed = name.trim();
  const problem = trimmed ? nameProblem(trimmed) : null;

  //availability, after typing stops
  React.useEffect(() => {
    setFree(undefined);
    if (!trimmed || problem) return;
    const timer = setTimeout(async () => {
      setFree(await nameIsFree(trimmed, { global, username }));
    }, 400);
    return () => clearTimeout(timer);
  }, [trimmed, global, username]);

  const shown = global ? trimmed : `${username}:${trimmed}`;
  const account = accounts.find((a) => a.address === register);
  const fee = nameFee(global);
  const canSave = !!trimmed && !problem && free !== false && !!register && !saving;

  const save = async () => {
    if (!canSave) return;
    const pin = await confirmPin({ fee });
    if (!pin) return;
    setSaving(true);
    try {
      await createName({ name: trimmed, register, global, pin });
      refreshUserAccounts();
      showSuccess(
        t('{name} is registered. It works once the transaction is confirmed.', {
          name: shown,
        })
      );
      goBack();
    } catch (err) {
      showError(err?.message);
      setSaving(false);
    }
  };

  const Option = ({ value, title, sub }) => (
    <TouchableRipple onPress={() => setGlobal(value)}>
      <View style={styles.option}>
        <RadioButton.Android
          value={String(value)}
          status={global === value ? 'checked' : 'unchecked'}
          color={theme.primary}
          onPress={() => setGlobal(value)}
        />
        <View style={{ flex: 1 }}>
          <Text bold>{title}</Text>
          <Text sub size={12}>
            {sub}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );

  return (
    <ScreenBody style={styles.wrapper}>
      <TextBox
        mode="outlined"
        label={t('Name')}
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
        autoFocus
        error={!!problem || free === false}
      />
      <Text
        size={12}
        style={{
          marginTop: 4,
          color:
            problem || free === false
              ? deltaColor('-')
              : free
              ? deltaColor('+')
              : undefined,
        }}
      >
        {problem ||
          (free === false
            ? t('{name} is taken', { name: shown })
            : free
            ? t('{name} is free', { name: shown })
            : trimmed && free === undefined
            ? t('Checking...')
            : ' ')}
      </Text>

      <Text sub size={13} style={styles.label}>
        {t('Kind')}
      </Text>
      <Option
        value={false}
        title={t('Local name')}
        sub={t('{name}  ·  fee {fee} NXS', {
          name: `${username}:${trimmed || t('name')}`,
          fee: nameFee(false),
        })}
      />
      <Option
        value={true}
        title={t('Global name')}
        sub={t('{name}  ·  fee {fee} NXS, unique on the network', {
          name: trimmed || t('name'),
          fee: nameFee(true).toLocaleString('en-US'),
        })}
      />

      <Text sub size={13} style={styles.label}>
        {t('Points to')}
      </Text>
      <Select
        options={accounts.map((a) => ({
          value: a.address,
          display: `${a.name || short(a.address)} (${a.ticker || 'NXS'})`,
        }))}
        value={register}
        updateValue={setRegister}
        render={({ display, openSelect }) => (
          <TouchableRipple onPress={openSelect}>
            <Text style={{ color: theme.primary, paddingVertical: 8 }} size={16}>
              {display || t('Pick an account')}
            </Text>
          </TouchableRipple>
        )}
      />

      {!!trimmed && !problem && (
        <Surface style={styles.preview}>
          <Text sub size={12} style={{ textTransform: 'uppercase' }}>
            {t('People will send to')}
          </Text>
          <Text bold size={18} style={{ marginTop: 4 }}>
            {shown}
          </Text>
          {!!account && (
            <Text sub size={12} style={{ marginTop: 4 }}>
              {t('instead of {address}', { address: short(account.address) })}
            </Text>
          )}
        </Surface>
      )}

      <FAB
        style={{ marginTop: 24 }}
        mode="contained"
        color={theme.onPrimary}
        disabled={!canSave}
        loading={saving}
        onPress={save}
        label={t('Register name ({fee} NXS)', { fee: fee.toLocaleString('en-US') })}
      />
      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

NewNameScreen.nav = {
  name: 'NewName',
  options: {
    title: 'New name',
  },
};
