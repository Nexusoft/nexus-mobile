import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import AttentionIcon from 'components/AttentionIcon';
import { navigate } from 'lib/navigation';
import { useTheme, disabledColor } from 'lib/theme';
import { fade } from 'utils/color';

const styles = {
  item: ({ small, padded }) => ({
    paddingVertical: small ? 12 : 16,
    paddingLeft: padded ? 36 : 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
  tag: ({ theme }) => ({
    fontSize: 10,
    backgroundColor: fade(theme.foreground, 0.8),
    color: disabledColor(theme.foreground),
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'uppercase',
  }),
};

export default function MenuItem({
  linkTo,
  icon,
  label,
  action,
  colorName,
  small,
  padded,
  comingSoon,
  warning,
}) {
  const theme = useTheme();
  return (
    <TouchableRipple
      borderless={false}
      onPress={
        comingSoon
          ? undefined
          : () => {
              if (linkTo) {
                navigate(linkTo);
              } else if (action) {
                action();
              }
            }
      }
    >
      <View style={styles.item({ small, padded })}>
        <View style={styles.content}>
          {!!icon && (
            <SvgIcon
              style={styles.itemIcon}
              icon={icon}
              colorName={colorName}
              size={small ? 14 : 16}
            />
          )}
          <Text size={small ? 14 : 16} colorName={colorName}>
            {label}
          </Text>
        </View>

        {comingSoon && <Text style={styles.tag({ theme })}>Coming soon</Text>}
        {warning && <AttentionIcon style={{ position: 'relative' }} />}
      </View>
    </TouchableRipple>
  );
}
