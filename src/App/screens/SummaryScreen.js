import React from 'react';
import { View, ScrollView } from 'react-native';
import { ActivityIndicator, Button, IconButton, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import ScreenBody from 'components/ScreenBody';
import Chip from 'components/Chip';
import Select from 'components/Select';
import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { deltaColor } from 'lib/contracts';
import {
  fetchTransactionsSince,
  toEntries,
  monthStart,
  summarize,
  tickersIn,
  toCsv,
  shareCsv,
} from 'lib/summary';
import { selectUsername } from 'lib/user';
import { showError, showNotification } from 'lib/ui';
import { t } from 'lib/i18n';
import formatNumber from 'utils/formatNumber';
import ChevronLeft from 'icons/chevron-left.svg';
import ChevronRight from 'icons/chevron-right.svg';
import ChartIcon from 'icons/chart.svg';

const chartMonths = 6;

const styles = {
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  chips: { paddingHorizontal: 14, paddingVertical: 6 },
  card: {
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  net: ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.dark ? '#2c3a48' : '#e8ecf1',
    paddingTop: 8,
  }),
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 90,
    marginTop: 16,
  },
  barSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
  bar: ({ color, ratio }) => ({
    width: 10,
    marginHorizontal: 1,
    height: `${Math.max(ratio * 100, ratio > 0 ? 3 : 0)}%`,
    backgroundColor: color,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  }),
  barLabels: { flexDirection: 'row', marginTop: 4 },
  legend: { flexDirection: 'row', marginTop: 8 },
  legendDot: ({ color }) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color,
    marginRight: 5,
    marginLeft: 12,
  }),
  sectionTitle: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  center: { padding: 30, alignItems: 'center' },
};

const inColor = '#1b9e5a';
const outColor = '#9aa6b5';

const amount = (value, ticker, sign = '') =>
  `${sign}${formatNumber(value, { maximumFractionDigits: 6 })} ${ticker}`;

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

const exportOptions = () => [
  { value: 'month', display: t('Selected month') },
  { value: 'year', display: t('Selected year') },
  { value: 'all', display: t('Whole history') },
];

export default function SummaryScreen() {
  const theme = useTheme();
  const username = useSelector(selectUsername);
  const [month, setMonth] = React.useState(() => monthStart(new Date()));
  const [loaded, setLoaded] = React.useState({ since: null, entries: [] });
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [ticker, setTicker] = React.useState(null);
  const [period, setPeriod] = React.useState('month');
  const [exporting, setExporting] = React.useState(false);
  const isCurrentMonth = month.isSame(monthStart(new Date()));

  //the chart needs the months before the selected one too
  const windowStart = month.clone().subtract(chartMonths - 1, 'months');
  React.useEffect(() => {
    if (loaded.since && !windowStart.isBefore(loaded.since)) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setProgress(0);
      try {
        const txs = await fetchTransactionsSince(windowStart, setProgress);
        if (!cancelled) {
          setLoaded({ since: windowStart, entries: toEntries(txs) });
        }
      } catch (err) {
        if (!cancelled) showError(err?.message || t('Could not load transactions'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [month.valueOf()]);

  const monthEnd = month.clone().add(1, 'month');
  const monthEntries = React.useMemo(
    () =>
      loaded.entries.filter(
        (e) => e.timestamp >= month.unix() && e.timestamp < monthEnd.unix()
      ),
    [loaded, month.valueOf()]
  );
  const tickers = React.useMemo(() => tickersIn(monthEntries), [monthEntries]);
  const shownTicker =
    ticker && tickers.includes(ticker) ? ticker : tickers[0] || null;
  const sum = shownTicker
    ? summarize(loaded.entries, shownTicker, month, monthEnd)
    : null;
  const chart = React.useMemo(() => {
    if (!shownTicker) return [];
    return Array.from({ length: chartMonths }, (_, i) => {
      const start = windowStart.clone().add(i, 'months');
      const s = summarize(
        loaded.entries,
        shownTicker,
        start,
        start.clone().add(1, 'month')
      );
      return { label: start.format('MMM'), in: s.in + s.stake, out: s.out + s.fee };
    });
  }, [loaded, shownTicker, month.valueOf()]);
  const chartMax = Math.max(1e-9, ...chart.map((m) => Math.max(m.in, m.out)));

  const exportCsv = async () => {
    setExporting(true);
    try {
      let since = null;
      let until = null;
      let label = 'all';
      if (period === 'month') {
        since = month;
        until = monthEnd;
        label = month.format('YYYY-MM');
      } else if (period === 'year') {
        since = month.clone().startOf('year');
        until = since.clone().add(1, 'year');
        label = since.format('YYYY');
      }
      const txs = await fetchTransactionsSince(since);
      const entries = toEntries(txs).filter(
        (e) => !until || e.timestamp < until.unix()
      );
      if (!entries.length) {
        showNotification(t('No transactions in this period'));
        return;
      }
      const name = `nexus-${username || 'wallet'}-${label}.csv`.replace(
        /[^A-Za-z0-9._-]/g,
        '_'
      );
      await shareCsv(name, toCsv(entries));
    } catch (err) {
      showError(err?.message || t('Could not export'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenBody>
      <View style={styles.monthBar}>
        <IconButton
          accessibilityLabel={t('Previous month')}
          icon={({ size, color }) => (
            <SvgIcon icon={ChevronLeft} size={size} color={color} />
          )}
          onPress={() => setMonth(month.clone().subtract(1, 'month'))}
        />
        <Text bold size={17}>
          {month.format('MMMM YYYY')}
        </Text>
        <IconButton
          accessibilityLabel={t('Next month')}
          disabled={isCurrentMonth}
          icon={({ size, color }) => (
            <SvgIcon icon={ChevronRight} size={size} color={color} />
          )}
          onPress={() => setMonth(month.clone().add(1, 'month'))}
        />
      </View>

      {tickers.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {tickers.map((t) => (
            <Chip
              key={t}
              label={t}
              active={t === shownTicker}
              onPress={() => setTicker(t)}
            />
          ))}
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text sub style={{ marginTop: 10 }}>
            {progress
              ? t('Reading transactions... {progress}', { progress })
              : t('Reading transactions...')}
          </Text>
        </View>
      ) : !sum ? (
        <View style={styles.center}>
          <Text sub>
            {t('No transactions in {month}.', { month: month.format('MMMM YYYY') })}
          </Text>
        </View>
      ) : (
        <Surface style={styles.card}>
          <Line label={t('Received')} value={amount(sum.in, shownTicker, '+')} color={deltaColor('+')} />
          <Line label={t('Sent')} value={amount(sum.out, shownTicker, '-')} color={deltaColor('-')} />
          {!!sum.stake && (
            <Line
              label={t('Staking rewards')}
              value={amount(sum.stake, shownTicker, '+')}
              color={deltaColor('+')}
            />
          )}
          {!!sum.fee && (
            <Line label={t('Fees')} value={amount(sum.fee, shownTicker, '-')} />
          )}
          <View style={styles.net({ theme })}>
            <Text bold>{t('Change this month')}</Text>
            <Text bold style={{ color: deltaColor(sum.net < 0 ? '-' : '+') }}>
              {amount(Math.abs(sum.net), shownTicker, sum.net < 0 ? '-' : '+')}
            </Text>
          </View>
          {!!sum.own && (
            <Text sub size={12} style={{ marginTop: 8 }}>
              {sum.own === 1
                ? t('1 move between your own accounts, not counted')
                : t('{count} moves between your own accounts, not counted', {
                    count: sum.own,
                  })}
            </Text>
          )}

          <View style={styles.bars} accessibilityLabel={t('Last 6 months')}>
            {chart.map((m, i) => (
              <View key={i} style={styles.barSlot}>
                <View style={styles.bar({ color: inColor, ratio: m.in / chartMax })} />
                <View style={styles.bar({ color: outColor, ratio: m.out / chartMax })} />
              </View>
            ))}
          </View>
          <View style={styles.barLabels}>
            {chart.map((m, i) => (
              <Text
                key={i}
                sub
                size={11}
                bold={i === chart.length - 1}
                style={{ flex: 1, textAlign: 'center' }}
              >
                {m.label}
              </Text>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendDot({ color: inColor })} />
            <Text sub size={11}>
              {t('In')}
            </Text>
            <View style={styles.legendDot({ color: outColor })} />
            <Text sub size={11}>
              {t('Out')}
            </Text>
          </View>
        </Surface>
      )}

      <Text sub size={13} style={styles.sectionTitle}>
        {t('Export history')}
      </Text>
      <Surface style={styles.card}>
        <Text sub size={13} style={{ marginBottom: 8 }}>
          {t('A CSV file with every transaction of the period, all tokens, for taxes or bookkeeping. It opens in any spreadsheet.')}
        </Text>
        <Select
          options={exportOptions()}
          value={period}
          updateValue={setPeriod}
          render={({ display, openSelect }) => (
            <View style={[styles.line, { alignItems: 'center' }]}>
              <Text>{t('Period')}</Text>
              <Button compact uppercase={false} onPress={openSelect}>
                {period === 'month'
                  ? month.format('MMMM YYYY')
                  : period === 'year'
                  ? t('Year {year}', { year: month.format('YYYY') })
                  : display}
              </Button>
            </View>
          )}
        />
        <Button
          mode="contained"
          labelStyle={{ color: theme.onPrimary }}
          loading={exporting}
          disabled={exporting}
          onPress={exportCsv}
        >
          {t('Share CSV file')}
        </Button>
      </Surface>
    </ScreenBody>
  );
}

SummaryScreen.nav = {
  name: 'Summary',
  icon: ChartIcon,
  options: {
    title: 'Summary and export',
  },
};
