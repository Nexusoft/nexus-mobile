import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import { confirm } from 'lib/ui';
import { updateSettings } from 'lib/settings';
import { t } from 'lib/i18n';
import formatNumber from 'utils/formatNumber';
import LogoFull from 'icons/logo-full.svg';
import CheckIcon from 'icons/check-circle.svg';

const tipTime = 7000;

const styles = {
  root: ({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.dark ? theme.background : theme.primary,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  }),
  title: {
    textAlign: 'center',
    marginTop: 26,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.85,
  },
  card: ({ theme }) => ({
    alignSelf: 'stretch',
    marginTop: 26,
    padding: 18,
    borderRadius: 16,
    backgroundColor: theme.dark ? theme.surface : 'rgba(255,255,255,0.16)',
  }),
  percentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    marginTop: 10,
  },
  fill: ({ percent, color }) => ({
    height: '100%',
    width: `${Math.min(100, Math.max(2, percent))}%`,
    borderRadius: 5,
    backgroundColor: color,
  }),
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  stepMark: ({ state, color }) => ({
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: state === 'next' ? 1.5 : 0,
    borderColor: color,
    opacity: state === 'next' ? 0.6 : 1,
  }),
  tip: ({ theme }) => ({
    alignSelf: 'stretch',
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.3)',
    minHeight: 92,
  }),
};

const getTips = () => [
  t('This happens only once. Later starts take a few seconds.'),
  t('Your phone runs its own Nexus node. No server holds your coins or your keys.'),
  t('Keep the app open for the fastest sync. On Android it also goes on in the background.'),
  t('Your username, password and PIN are your wallet. They work in the desktop wallet too.'),
  t('Set a recovery phrase after you log in, so you can reset a lost password or PIN.'),
];

function Step({ state, label, color }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepMark({ state, color })}>
        {state === 'done' && <SvgIcon icon={CheckIcon} size={22} color={color} />}
        {state === 'active' && <ActivityIndicator size={16} color={color} />}
      </View>
      <Text
        size={15}
        color={color}
        bold={state === 'active'}
        style={{ flex: 1, opacity: state === 'next' ? 0.7 : 1 }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function SyncScreen() {
  const theme = useTheme();
  const info = useSelector((state) => state.core.info);
  const sync = info?.syncing;
  const percent = Number(sync?.completed) || 0;
  const color = theme.dark ? theme.foreground : theme.onPrimary;
  const tips = getTips();
  const [tip, setTip] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => setTip((i) => (i + 1) % tips.length), tipTime);
    return () => clearInterval(timer);
  }, [tips.length]);

  const ignore = async () => {
    const confirmed = await confirm({
      title: t('Ignore database initialization?'),
      message: t(
        'When the app is initializing the blockchain database, login might not work as intended and inaccurate balances might be shown.\nAre you sure you want to ignore this process and proceed to use the app anyway?'
      ),
      cancelLabel: t('Stay and wait'),
      confirmLabel: t('Ignore'),
      danger: true,
    });
    if (confirmed) updateSettings({ ignoreSyncScreen: true });
  };

  return (
    <ScrollView contentContainerStyle={styles.root({ theme })}>
      <SvgIcon icon={LogoFull} width={170} height={60} color={color} />
      <Text bold size={22} color={color} style={styles.title}>
        {t('Setting up your wallet')}
      </Text>
      <Text size={14} color={color} style={styles.subtitle}>
        {t('Your phone is downloading the Nexus blockchain headers so it can check everything itself.')}
      </Text>

      <View style={styles.card({ theme })}>
        <View style={styles.percentRow}>
          <Text size={34} color={color}>
            {formatNumber(percent, { maximumFractionDigits: 1 })}
            <Text size={18} color={color}>
              {' %'}
            </Text>
          </Text>
          {!!sync?.timeRemaining && (
            <Text size={13} color={color} style={{ opacity: 0.85 }}>
              {t('{time} left', { time: sync.timeRemaining })}
            </Text>
          )}
        </View>
        <View style={styles.track}>
          <View style={styles.fill({ percent, color })} />
        </View>
        <View style={styles.meta}>
          <Text size={12} color={color} style={{ opacity: 0.8 }}>
            {info?.blocks
              ? t('Block {height}', { height: formatNumber(info.blocks) })
              : ''}
          </Text>
          <Text size={12} color={color} style={{ opacity: 0.8 }}>
            {t('{count} peers', { count: info?.connections ?? 0 })}
          </Text>
        </View>

        <Step state="done" color={color} label={t('Connected to the Nexus network')} />
        <Step state="active" color={color} label={t('Downloading block headers')} />
        <Step state="next" color={color} label={t('Log in or create your profile')} />
      </View>

      <View style={styles.tip({ theme })}>
        <Text bold size={12} color={color} style={{ textTransform: 'uppercase', opacity: 0.8 }}>
          {t('Good to know')}
        </Text>
        <Text size={14} color={color} style={{ marginTop: 6, lineHeight: 20 }}>
          {tips[tip]}
        </Text>
      </View>

      <Button
        mode="text"
        color={color}
        labelStyle={{ fontSize: 12, opacity: 0.85 }}
        style={{ marginTop: 'auto', paddingTop: 24 }}
        onPress={ignore}
      >
        {t('Skip waiting')}
      </Button>
    </ScrollView>
  );
}
