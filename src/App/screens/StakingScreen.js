import React from 'react';
import { View, RefreshControl } from 'react-native';
import { ActivityIndicator, Button, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Switch from 'components/Switch';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import {
  fetchStakeInfo,
  fetchStakeRewards,
  setStake,
  setStaking,
} from 'lib/staking';
import { confirmPin, showError, showSuccess } from 'lib/ui';
import { refreshUserAccounts } from 'lib/user';
import { t } from 'lib/i18n';
import formatNumber from 'utils/formatNumber';
import parseAmount from 'utils/parseAmount';
import useRefresh from 'utils/useRefresh';
import StakeIcon from 'icons/stake.svg';

const styles = {
  hero: ({ theme }) => ({
    backgroundColor: theme.dark ? theme.surface : theme.primary,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
  }),
  pill: ({ color }) => ({
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: color,
  }),
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
  meter: ({ theme }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.dark ? '#2c3a48' : '#e3eaf2',
    overflow: 'hidden',
    marginBottom: 12,
  }),
  meterFill: ({ theme, ratio }) => ({
    height: '100%',
    width: `${Math.min(100, Math.max(0, ratio))}%`,
    backgroundColor: theme.primary,
  }),
  note: ({ theme }) => ({
    marginHorizontal: 14,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.dark ? '#173445' : '#e3f5fe',
  }),
  center: { padding: 30, alignItems: 'center' },
};

const nxs = (value, digits = 6) =>
  `${formatNumber(value || 0, { maximumFractionDigits: digits })} NXS`;

function Line({ label, value, color }) {
  return (
    <View style={styles.line}>
      <Text sub>{label}</Text>
      <Text bold style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

function Meter({ label, value }) {
  const theme = useTheme();
  return (
    <>
      <Line label={label} value={`${formatNumber(value || 0, { maximumFractionDigits: 1 })} %`} />
      <View style={styles.meter({ theme })}>
        <View style={styles.meterFill({ theme, ratio: value || 0 })} />
      </View>
    </>
  );
}

function ChangeStake({ info, onChanged }) {
  const theme = useTheme();
  const [value, setValue] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const amount = parseAmount(value);
  const max = (info.stake || 0) + (info.balance || 0);
  let error = null;
  if (value && !(amount >= 0)) error = t('Enter an amount');
  else if (value && amount === info.stake) error = t('That is the stake you have now');
  else if (value && amount > max) error = t('More than staked plus the trust account balance');
  const lower = value && !error && amount < info.stake;

  const save = async () => {
    if (!value || error) return;
    const pin = await confirmPin({});
    if (!pin) return;
    setSaving(true);
    try {
      await setStake(amount, pin);
      setValue('');
      showSuccess(
        t('Stake change asked for. It is applied with the next stake block.')
      );
      onChanged();
    } catch (err) {
      showError(err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Surface style={styles.card}>
      <Text bold style={{ marginBottom: 6 }}>
        {t('Change stake')}
      </Text>
      <Text sub size={13}>
        {t('Trust account balance: {balance}. More than now comes from it, less goes back to it. To stake more, send NXS to the trust account first.', { balance: nxs(info.balance) })}
      </Text>
      <TextBox
        mode="outlined"
        label={t('New stake (total)')}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
        error={!!error}
        style={{ marginTop: 10 }}
      />
      {!!error && (
        <Text size={12} style={{ color: deltaColor('-'), marginTop: 4 }}>
          {error}
        </Text>
      )}
      {lower && (
        <Text sub size={12} style={{ marginTop: 4 }}>
          {t('Lowering the stake also lowers your trust in the same ratio.')}
        </Text>
      )}
      <View style={[styles.line, { marginTop: 10, marginBottom: 0 }]}>
        <Button compact onPress={() => setValue(String(max))}>
          {t('Stake all')}
        </Button>
        <Button
          mode="contained"
          labelStyle={{ color: theme.onPrimary }}
          disabled={!value || !!error || saving}
          loading={saving}
          onPress={save}
        >
          {t('Change stake')}
        </Button>
      </View>
    </Surface>
  );
}

function StakeMinter({ info, onChanged }) {
  const [busy, setBusy] = React.useState(false);
  return (
    <Surface style={styles.card}>
      <View style={[styles.line, { marginBottom: 0 }]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text bold>{t('Stake with this core')}</Text>
          <Text sub size={12}>
            {info.staking
              ? t('The core stakes for this profile now.')
              : t('Keeps the profile unlocked for staking in the core.')}
          </Text>
        </View>
        <Switch
          value={!!info.staking}
          disabled={busy}
          onValueChange={async (on) => {
            const pin = await confirmPin({});
            if (!pin) return;
            setBusy(true);
            try {
              await setStaking(on, pin);
              onChanged();
            } catch (err) {
              showError(err?.message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </View>
    </Surface>
  );
}

export default function StakingScreen() {
  const theme = useTheme();
  const lite = useSelector((state) => !!state.core.info?.litemode);
  const [info, setInfo] = React.useState(undefined);
  const [rewards, setRewards] = React.useState([]);
  const load = async () => {
    try {
      const [stakeInfo, list] = await Promise.all([
        fetchStakeInfo(),
        fetchStakeRewards().catch(() => []),
      ]);
      setInfo(stakeInfo);
      setRewards(list);
    } catch (err) {
      setInfo(null);
      showError(err?.message);
    }
  };
  const [refreshing, refresh] = useRefresh(async () => {
    await load();
    refreshUserAccounts();
  });
  React.useEffect(() => {
    load();
  }, []);

  if (info === undefined) {
    return (
      <ScreenBody>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </ScreenBody>
    );
  }
  if (info === null) {
    return (
      <ScreenBody>
        <View style={styles.center}>
          <Text sub style={{ textAlign: 'center' }}>
            {t('This profile has no trust account yet. It is made with the profile on the main network; staking starts once NXS are in it and staked.')}
          </Text>
        </View>
      </ScreenBody>
    );
  }

  const fg = theme.dark ? theme.foreground : theme.onPrimary;
  const status = info.onhold
    ? { label: t('On hold'), color: '#a4720a' }
    : info.staking
    ? { label: t('Staking'), color: '#1b9e5a' }
    : { label: t('Not staking'), color: 'rgba(0,0,0,0.25)' };
  const monthStart = moment().startOf('month').unix();
  const monthRewards = rewards
    .filter((r) => r.timestamp >= monthStart)
    .reduce((sum, r) => sum + r.amount, 0);
  const perYear = ((info.stake || 0) * (info.stakerate || 0)) / 100;

  return (
    <ScreenBody
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      <View style={styles.hero({ theme })}>
        <Text size={13} color={fg} style={{ textTransform: 'uppercase', opacity: 0.85 }}>
          {t('Staked')}
        </Text>
        <Text size={30} color={fg} style={{ marginTop: 4 }}>
          {nxs(info.stake)}
        </Text>
        <Text size={14} color={fg} style={{ opacity: 0.9 }}>
          {t('stake rate {rate} % a year', {
            rate: formatNumber(info.stakerate || 0, { maximumFractionDigits: 2 }),
          })}
        </Text>
        <View style={styles.pill(status)}>
          <Text size={12} bold color="#fff">
            {status.label}
          </Text>
        </View>
      </View>

      {lite && (
        <View style={styles.note({ theme })}>
          <Text sub size={13}>
            {t('This phone runs a light Nexus core, which cannot stake itself. Staking runs on a full node with this profile, for example the desktop wallet. You can still see and change your stake here.')}
          </Text>
        </View>
      )}
      {!!info.onhold && (
        <View style={styles.note({ theme })}>
          <Text sub size={13}>
            {t('Staking starts in about {minutes} minutes, a new or changed stake waits first.', { minutes: Math.max(1, Math.round((info.holdtime || 0) / 60)) })}
          </Text>
        </View>
      )}
      {!!info.change && (
        <View style={styles.note({ theme })}>
          <Text sub size={13}>
            {t('Stake change to {amount} waits for the next stake block.', {
              amount: nxs(info.amount),
            })}
          </Text>
        </View>
      )}

      <Surface style={styles.card}>
        <Line
          label={t('Rewards this month')}
          value={`+${nxs(monthRewards)}`}
          color={deltaColor('+')}
        />
        <Line label={t('Estimate per year')} value={nxs(perYear, 2)} />
        <Line label={t('Not staked yet')} value={nxs(info.balance)} />
        <Meter label={t('Trust weight')} value={info.trustweight} />
        <Meter label={t('Stake weight')} value={info.stakeweight} />
      </Surface>

      <Surface style={styles.card}>
        <Text bold style={{ marginBottom: 8 }}>
          {t('Last rewards')}
        </Text>
        {rewards.length ? (
          rewards.slice(0, 10).map((r) => (
            <View key={r.txid} style={styles.line}>
              <Text sub>{moment.unix(r.timestamp).format('D MMM YYYY HH:mm')}</Text>
              <Text style={{ color: deltaColor('+') }}>
                +{formatNumber(r.amount, { maximumFractionDigits: 6 })}
              </Text>
            </View>
          ))
        ) : (
          <Text sub>{t('No rewards yet.')}</Text>
        )}
      </Surface>

      <ChangeStake info={info} onChanged={load} />
      {!lite && <StakeMinter info={info} onChanged={load} />}
      <View style={{ height: 30 }} />
    </ScreenBody>
  );
}

StakingScreen.nav = {
  name: 'Staking',
  icon: StakeIcon,
  options: {
    title: 'Staking',
  },
};
