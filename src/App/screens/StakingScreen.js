import React from 'react';
import { View, RefreshControl } from 'react-native';
import { ActivityIndicator, Button, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Slider from 'components/Slider';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import {
  fetchStakeInfo,
  fetchStakeRewards,
  setStake,
  setStaking,
  lowStakeWarnBelow,
} from 'lib/staking';
import { confirm, confirmPin, showError, showSuccess } from 'lib/ui';
import { navigate } from 'lib/navigation';
import { trustAccountOf, defaultAccountOf } from 'lib/accounts';
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 8,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  preset: {
    marginRight: 6,
    marginTop: 4,
  },
  warn: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff3d6',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  button: {
    marginRight: 8,
    marginTop: 4,
  },
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

const sliderStep = (max) => (max >= 1000 ? 1 : max >= 10 ? 0.1 : 0.000001);
const roundTo = (value, step) =>
  step >= 1 ? Math.round(value) : Math.round(value / step) * step;

function StakeControl({ info, lite, onChanged }) {
  const theme = useTheme();
  const accounts = useSelector((state) => state.user.accounts);
  const stake = info.stake || 0;
  const max = stake + (info.balance || 0);
  const pendingTotal = info.change ? stake + (info.amount || 0) : null;
  const [target, setTarget] = React.useState(pendingTotal ?? stake);
  const [typing, setTyping] = React.useState(false);
  const [typed, setTyped] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const step = sliderStep(max);
  const isNew = !!info.new;
  const stopPending = pendingTotal === 0;
  const trust = trustAccountOf(accounts);
  const from = defaultAccountOf(accounts);

  React.useEffect(() => {
    setTarget(pendingTotal ?? stake);
  }, [stake, pendingTotal]);

  const run = async (action) => {
    setBusy(true);
    try {
      await action();
      onChanged();
    } catch (err) {
      showError(err?.message);
    } finally {
      setBusy(false);
    }
  };

  const warnSmall = async (amount) =>
    !(amount > 0 && amount < lowStakeWarnBelow && amount > stake) ||
    (await confirm({
      title: t('Stake this small amount?'),
      message: t(
        'Staked NXS are locked in your trust account and only come back when your stake produces a block. A small stake can take a very long time, or never, to produce one, so the coins may stay locked with no reward. Nexus pooled staking for small holders is not available.'
      ),
      confirmLabel: t('Stake anyway'),
      cancelLabel: t('Cancel'),
      danger: true,
    }));

  const changeStake = async () => {
    if (!(await warnSmall(target))) return;
    const pin = await confirmPin({});
    if (!pin) return;
    await run(async () => {
      await setStake(target, pin);
      showSuccess(t('Stake change saved. It is applied with the next stake block.'));
    });
  };

  const start = async () => {
    if (!isNew && target !== stake && !(await warnSmall(target))) return;
    if (isNew && !(await warnSmall(info.balance || 0))) return;
    const pin = await confirmPin({});
    if (!pin) return;
    await run(async () => {
      if (!isNew && target !== stake) await setStake(target, pin);
      await setStaking(true, pin);
      showSuccess(t('Staking started.'));
    });
  };

  const stop = async () => {
    const ok = await confirm({
      title: t('Stop staking?'),
      message: isNew
        ? t('The core stops staking for this profile. The NXS stay in the trust account.')
        : t('Your stake is set to 0. The staked NXS go back to the trust account balance with the next stake block, so the core has to keep staking until then. The trust you built up is lost.'),
      confirmLabel: t('Stop staking'),
      cancelLabel: t('Cancel'),
      danger: true,
    });
    if (!ok) return;
    const pin = await confirmPin({});
    if (!pin) return;
    await run(async () => {
      if (isNew) await setStaking(false, pin);
      else {
        await setStake(0, pin, 0);
        showSuccess(t('Unstake saved. The NXS come back with the next stake block.'));
      }
    });
  };

  const typedAmount = parseAmount(typed);
  const typedError =
    typing && typed
      ? !(typedAmount >= 0)
        ? t('Enter an amount')
        : typedAmount > max
        ? t('More than staked plus the trust account balance')
        : null
      : null;

  const delta = roundTo(target - stake, step);
  const canChange = !lite && !isNew && !busy && target !== stake && !(pendingTotal !== null && target === pendingTotal);
  const canStart = !lite && !busy && !info.staking && (isNew ? (info.balance || 0) > 0 : max > 0);
  const canStop = !lite && !busy && (isNew ? !!info.staking : stake > 0 && !stopPending);

  return (
    <Surface style={styles.card}>
      <Text bold style={{ marginBottom: 4 }}>
        {t('Your stake')}
      </Text>

      {isNew ? (
        <Text sub size={13}>
          {t('Your first stake block (Genesis) stakes the whole trust account balance: {balance}. After that you can set the amount here.', { balance: nxs(info.balance) })}
        </Text>
      ) : (
        <>
          <View style={styles.amountRow}>
            <Text size={26}>{formatNumber(target, { maximumFractionDigits: step >= 1 ? 0 : 6 })}</Text>
            <Text sub size={14} style={{ marginLeft: 6 }}>
              NXS
            </Text>
          </View>
          <Text sub size={13} style={{ textAlign: 'center', minHeight: 18 }}>
            {delta > 0
              ? t('{amount} more is locked from the trust account balance', { amount: nxs(delta) })
              : delta < 0
              ? t('{amount} goes back to the trust account balance', { amount: nxs(-delta) })
              : pendingTotal !== null && target === pendingTotal
              ? t('This change is already waiting')
              : t('Your stake now')}
          </Text>
          <Slider
            value={target}
            min={0}
            max={max}
            step={step}
            disabled={lite || busy || max <= 0}
            onChange={(v) => {
              setTyping(false);
              setTarget(v);
            }}
            style={{ marginTop: 8 }}
            testID="stake-slider"
          />
          <View style={[styles.line, { marginBottom: 2 }]}>
            <Text sub size={12}>0</Text>
            <Text sub size={12}>{nxs(max)}</Text>
          </View>
          <View style={styles.presets}>
            {[0.25, 0.5, 0.75, 1].map((part) => (
              <Button
                key={part}
                compact
                mode="outlined"
                disabled={lite || busy || max <= 0}
                style={styles.preset}
                labelStyle={{ fontSize: 12, marginHorizontal: 4 }}
                onPress={() => {
                  setTyping(false);
                  setTarget(part === 1 ? max : roundTo(max * part, step));
                }}
              >
                {part === 1 ? t('All') : `${part * 100} %`}
              </Button>
            ))}
            <Button
              compact
              disabled={lite || busy || max <= 0}
              labelStyle={{ fontSize: 12, marginHorizontal: 4 }}
              onPress={() => {
                setTyped(String(target));
                setTyping(!typing);
              }}
            >
              {t('Type')}
            </Button>
          </View>
          {typing && (
            <>
              <TextBox
                mode="outlined"
                label={t('New stake (total)')}
                value={typed}
                onChangeText={(text) => {
                  setTyped(text);
                  const v = parseAmount(text);
                  if (v >= 0 && v <= max) setTarget(v);
                }}
                decimal
                error={!!typedError}
                style={{ marginTop: 8 }}
              />
              {!!typedError && (
                <Text size={12} style={{ color: deltaColor('-'), marginTop: 4 }}>
                  {typedError}
                </Text>
              )}
            </>
          )}
          {delta < 0 && (
            <Text sub size={12} style={{ marginTop: 6 }}>
              {t('Lowering the stake also lowers your trust in the same ratio.')}
            </Text>
          )}
          {target > 0 && target < lowStakeWarnBelow && (
            <View style={styles.warn}>
              <Text size={12} style={{ color: '#8a5d00' }}>
                {t('Small stakes rarely produce a stake block, and staked NXS stay locked until one comes. Most stakers use well over {amount}.', { amount: nxs(lowStakeWarnBelow, 0) })}
              </Text>
            </View>
          )}
        </>
      )}

      <View style={styles.buttons}>
        {!info.staking && (
          <Button
            mode="contained"
            labelStyle={{ color: theme.onPrimary }}
            disabled={!canStart}
            loading={busy}
            style={styles.button}
            onPress={start}
          >
            {t('Start staking')}
          </Button>
        )}
        {!isNew && (info.staking || stake > 0) && (
          <Button
            mode="contained"
            labelStyle={{ color: theme.onPrimary }}
            disabled={!canChange}
            loading={busy}
            style={styles.button}
            onPress={changeStake}
          >
            {t('Set stake')}
          </Button>
        )}
        {(isNew ? !!info.staking : stake > 0) && (
          <Button
            mode="outlined"
            color={deltaColor('-')}
            disabled={!canStop}
            style={styles.button}
            onPress={stop}
          >
            {stopPending ? t('Stop requested') : t('Stop staking')}
          </Button>
        )}
      </View>

      {lite && (
        <Text sub size={12} style={{ marginTop: 8 }}>
          {t('Disabled on this phone: a light core cannot stake, and a stake change is saved only in the core that stakes. Change it in the wallet that stakes this profile, or connect this app to that core.')}
        </Text>
      )}

      {!!trust && !!from && (from.balance || 0) > 0 && (
        <Button
          compact
          mode="text"
          style={{ alignSelf: 'flex-start', marginTop: 8, marginLeft: -6 }}
          onPress={() => navigate('Send', { account: from, sendTo: trust.address })}
        >
          {t('Add NXS to the trust account')}
        </Button>
      )}
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
            {t('This phone runs a light Nexus core, which cannot stake itself. Staking runs on a full node with this profile, for example the desktop wallet. You can follow your stake here.')}
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
              amount: nxs((info.stake || 0) + (info.amount || 0)),
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

      <StakeControl info={info} lite={lite} onChanged={load} />
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
