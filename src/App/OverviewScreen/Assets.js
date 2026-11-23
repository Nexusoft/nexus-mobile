import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import { t } from 'lib/i18n';
import { selectSetting } from 'lib/settings';
import formatNumber from 'utils/formatNumber';
import { selectMarketPrice } from 'lib/market';

const styles = {
  header: {
    paddingTop: 14,
    paddingBottom: 6,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  badge: ({ color }) => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  }),
  name: {
    flex: 1,
  },
  value: {
    alignItems: 'flex-end',
  },
};

const palette = ['#7b61ff', '#ff8a3d', '#1fb59a', '#e05297', '#5b8def', '#c9a227'];

const colorFor = (token) => {
  if (token === '0') return '#08b4f8';
  let hash = 0;
  for (const ch of String(token)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
};

//one row per coin/token, summed over the user's accounts
export function groupAssets(accounts) {
  const assets = new Map();
  for (const acc of accounts || []) {
    const token = acc.token || '0';
    const ticker =
      token === '0' ? 'NXS' : acc.ticker || acc.token_name || token.slice(0, 6);
    const entry = assets.get(token) || { token, ticker, amount: 0, count: 0 };
    entry.amount += (acc.balance || 0) + (acc.stake || 0);
    entry.count += 1;
    assets.set(token, entry);
  }
  return [...assets.values()].sort((a, b) =>
    a.token === '0' ? -1 : b.token === '0' ? 1 : b.amount - a.amount
  );
}

export default function Assets({ accounts }) {
  const hideBalances = useSelector(selectSetting('hideBalances'));
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const price = useSelector(selectMarketPrice);
  const assets = groupAssets(accounts);
  if (!assets.length) return null;
  return (
    <View>
      <Text sub style={styles.header}>
        {t('Assets')}
      </Text>
      {assets.map((asset, i) => (
        <React.Fragment key={asset.token}>
          {i !== 0 && <Divider />}
          <TouchableRipple onPress={() => navigate('Accounts')}>
            <View style={styles.row}>
              <View style={styles.badge({ color: colorFor(asset.token) })}>
                <Text bold style={{ color: '#fff' }}>
                  {asset.ticker.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={styles.name}>
                <Text bold>{asset.ticker}</Text>
                <Text sub size={12}>
                  {asset.count === 1
                    ? t('1 account')
                    : t('{count} accounts', { count: asset.count })}
                </Text>
              </View>
              <View style={styles.value}>
                <Text bold>
                  {hideBalances
                    ? '???'
                    : formatNumber(asset.amount, { maximumFractionDigits: 6 })}
                </Text>
                {asset.token === '0' && !!price && !hideBalances && (
                  <Text sub size={12}>
                    {formatNumber(asset.amount * price, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    {baseCurrency}
                  </Text>
                )}
              </View>
            </View>
          </TouchableRipple>
        </React.Fragment>
      ))}
    </View>
  );
}
