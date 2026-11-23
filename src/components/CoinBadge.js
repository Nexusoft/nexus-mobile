import React from 'react';
import { View } from 'react-native';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import { t } from 'lib/i18n';
import NexusIcon from 'icons/nexus.svg';
import TokenIcon from 'icons/token.svg';

const styles = {
  pill: ({ theme, coin }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: coin
      ? theme.dark
        ? '#173445'
        : '#e3f5fe'
      : theme.dark
      ? '#2a3038'
      : '#eef1f5',
  }),
};

//round Nexus logo for NXS, token glyph for tokens
export function CoinIcon({ coin = true, size = 16, color, style }) {
  const theme = useTheme();
  return (
    <SvgIcon
      icon={coin ? NexusIcon : TokenIcon}
      size={size}
      color={color || (coin ? theme.primary : undefined)}
      sub={!coin && !color}
      style={style}
    />
  );
}

//"Nexus coin" for NXS, "Token" for everything else
export default function CoinBadge({ coin = true, style }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill({ theme, coin }), style]}>
      <CoinIcon coin={coin} size={11} style={{ marginRight: 4 }} />
      <Text size={11} bold color={coin ? theme.primary : undefined} sub={!coin}>
        {coin ? t('Nexus coin') : t('Token')}
      </Text>
    </View>
  );
}
